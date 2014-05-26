import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.bson.BSONObject;

import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBObject;
import com.mongodb.MongoClient;
import com.mongodb.WriteConcern;

public class WebDoc {
	protected Set<String> crawledList;
	protected LinkedHashSet<String>  toCrawlList; 
	protected HashSet<String> domains ;
	static MongoClient mongo;
	DB dataBase;
	DBCollection coll;
	
	public static void main(String[] args) throws Exception {
		WebDoc c = new WebDoc();
		String[] seeds = {
				"http://www.alexa.com/topsites",
				"http://en.wikipedia.org/wiki/List_of_most_popular_websites",
				"http://moz.com/top500"
				};
		
		Runtime.getRuntime().addShutdownHook(new Thread() {
		    public void run() { 
		    	closeConnections();
		    	System.out.println("Now Exiting");
		    }
		 });
		
		try {
			c.Crawl(seeds);
		} catch (IOException e1){
			System.out.println("IO Exception");
			e1.printStackTrace();
		} catch (InterruptedException e2) {
			System.out.println("Interruption caught");
			e2.printStackTrace();
		}
	}
	
	private static void closeConnections(){
		mongo.close();
	}
	
	private static String extractDomains(String value) throws Exception{
	    if (value == null) throw new Exception("domains to extract");
	    String result = new String();
	    String domainPattern = "[a-z0-9\\-\\.]+\\.(com|org|net|mil|edu|(co\\.[a-z].))";
	    Pattern p = Pattern.compile(domainPattern,Pattern.CASE_INSENSITIVE);
	    Matcher m = p.matcher(value);
	    while (m.find()) {
	        result = value.substring(m.start(0),m.end(0));
	    }
	    return result;
	}
	
	public void Crawl(String[] startUrls) throws Exception {	
		// Set up crawl lists.
		int count=0;
		 int total=0;
		crawledList = new HashSet<String>();
		toCrawlList = new LinkedHashSet<String>();
		mongo = new MongoClient("localhost", 27017);
		dataBase = mongo.getDB("Crawler");
		coll = dataBase.getCollection("Domains");
		mongo.setWriteConcern(WriteConcern.JOURNALED);
		
		// Add start URL to the5To Crawl list.
		for (String s:startUrls){
			toCrawlList.add(s);	
		}
		
		// Add page to the crawled list.
		do{
			
			String url = (String) toCrawlList.iterator().next();
			
			URL verifiedUrl = verifyUrl(url);
			
			String baseUrl = extractDomains(url);
			
			if(!crawledList.contains(baseUrl)){
				crawledList.add(baseUrl);
				System.out.println("Current URL is :"+ baseUrl );

//				coll.insert(new BasicDBObject("Domain", baseUrl));
				
				toCrawlList.remove(new String(url));
			} else {
				toCrawlList.remove(new String(url));
			}
		    // Download the page at the given URL.
		    
		    
		    String pageContents = downloadPage(verifiedUrl);
		
		    if (pageContents != null && pageContents.length() > 0) {
 			
	   		// Retrieve list of valid links from page.
		
	   		ArrayList<String> links = retrieveLinks(verifiedUrl, pageContents, toCrawlList);
			
	   		// Add links to the To Crawl list.
			
	   		toCrawlList.addAll(links);
	   		
	   		}
	   		count++;
	   		if(count==100){
	   			break ;
	   		}
		}while( !toCrawlList.isEmpty());
	   
	}
	
	
	private ArrayList<String> getTags(String pageContent){
		ArrayList<String> tags = new ArrayList<String>();
		
		return tags;
	}
	
	private String downloadPage(URL pageUrl) {
		try {
	 	
			// Open connection to URL for reading.
	 		
			BufferedReader reader = new BufferedReader(new InputStreamReader(pageUrl.openStream()));
			
			// Read page into buffer.
			
			String line;
			StringBuffer pageBuffer = new StringBuffer();
			while ((line = reader.readLine()) != null) {
				pageBuffer.append(line);
				}
			return pageBuffer.toString();
			} catch (Exception e) {
		}
		return null;
	}
	
	private URL verifyUrl(String url) {
		  if (!url.toLowerCase().startsWith("http://")) {
			return null;
		  }
		  URL verifiedUrl = null;
		  try {
		verifiedUrl = new URL(url);
		  } catch (Exception e) {
		return null;
		  }
		  return verifiedUrl;
	}
	
	private ArrayList<String> retrieveLinks(URL pageUrl, String pageContents, HashSet<String> crawledList) {
		Pattern p = Pattern.compile("<a\\s+href\\s*=\\s*\"?(.*?)[\"|>]", Pattern.CASE_INSENSITIVE);
		  Matcher m = p.matcher(pageContents);
		  
		  // Create list of link matches.
		  
		  ArrayList<String> linkList = new ArrayList<String>();
		  while (m.find()) {
			  String link = m.group(1).trim();
			 
			  // Skip empty links.
			  
			  if (link.length() < 1) {
				  continue;
			}
			// Skip links that are just page anchors.
			
			  if (link.charAt(0) == '#') {
				  continue;
			}		
			// Skip mailto links.
			
			  if (link.indexOf("mailto:") != -1) {
				  continue;
			}
			  // Skip Javascript links.
			
			  if (link.toLowerCase().indexOf("javascript") != -1) {
				  continue;
   			}
			// Prefix absolute and relative URLs if necessary.
			
			  if (link.indexOf("://") == -1) {
				  // Handle absolute URLs.
				
				  if (link.charAt(0) == '/') {
					link = "http://" + pageUrl.getHost() + link;
					  // Handle relative URLs.
				  } 
				  else {
					String file = pageUrl.getFile();
					if (file.indexOf('/') == -1) {
						  link = "http://" + pageUrl.getHost() + "/" + link;
					} 
					else {
						  String path = file.substring(0, file.lastIndexOf('/') + 1); 
						  link = "http://" + pageUrl.getHost() + path + link;
					}
				  }
			}
			// Remove anchors from link.
			int index = link.indexOf('#');
			if (index != -1) {
				  link = link.substring(0, index);
			}
			// Remove leading "www" from URL's host if present. 
			//link = removeWwwFromUrl(link);
			// Verify link and skip if invalid.
			URL verifiedLink = verifyUrl(link);
			if (verifiedLink == null) {
				  continue;
			}
			// Skip link if it has already been crawled.
			if (crawledList.contains(link)) {
				  continue;
			}
			// Add link to list.
			linkList.add(link);
		  }
		  return (linkList);
	}
	
	private String removeWwwFromUrl(String url) {
		  int index = url.indexOf("://www.");
		  if (index != -1) {
			return url.substring(0, index + 3) + url.substring(index + 7);
		  }
		  return (url);
	}
}
