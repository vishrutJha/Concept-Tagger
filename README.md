Concept-Tagger
==============

Web Crawler with concept tagging for crawled websites

Requirements:
  + python 2.7+
  + mongoDB

Dependencies:
  + jsoup
  + MongoDriver java
  + pymongo
  + urllib2

Set UP:

1> Install mongodb on your machine:
   
    Follow guide as per your OS:

	http://docs.mongodb.org/manual/installation/

2> Set up python dependencies:

    	sudo apt-get install python-pip

    for windows download pip package for python
	
	https://pypi.python.org/pypi/pip

    pip install pymongo
    pip install urllib2  # may not be required

3> Download java dependencies

    download the ones stated before or use the ones included in the package\res

4> Working:

    i) If you an eclipse lover:
	- import this structure as is into eclipse
	- import jar files and link'em up
	- F11
	- run the conceptTagger.py

    ii) Terminal Fools:
	- enter the src folder
	- compile with libraries:
		
	    javac -classpath ../res/<the jar file> WebDoc.java

	- run the java file
	
	    java WebDoc

	    This will keep crawling and get all domain names to populate your database
	    + coming soon a multithreaded crawler 
	- enter /res, run the python file

	    python conceptTagger.py
 
5> In case off doubts, leave a comment
