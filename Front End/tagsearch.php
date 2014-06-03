<?php

$m=new MongoClient();
$db=$m->Crawler;
$coll=$db->Domains;

if(isset($_REQUEST["q"])){
	$query = $_REQUEST["q"];
	
	$tags = explode(" ", $query);
	$query = $tags[0];
	$cur = $coll->find(array("Domain" => new MongoRegex("/$query/i")));
	$cur2 = $coll->find(array(
		    'tags' => array('$in' => $tags)
	    ));
} else {
	$cur = $coll->find();
}

$result = array();
$dedup = array();

foreach($cur2 as $item){
    if(!isset($dedup[$item["Domain"]])){
	$par_res = array();
	$par_res["domain"] = $item["Domain"];
	if(isset($item["tags"])){
		$par_res["tags"] = $item["tags"];
	} else {
		$par_res["tags"] = [];
	}
	$result[] = $par_res;
	$dedup[$item["Domain"]] = 1;
    } 
}

foreach($cur as $item){
    if(!isset($dedup[$item["Domain"]])){
	$par_res = array();
	$par_res["domain"] = $item["Domain"];
	if(isset($item["tags"])){
		$par_res["tags"] = $item["tags"];
	} else {
		$par_res["tags"] = [];
	}
	$result[] = $par_res;
	$dedup[$item["Domain"]] = 1;
    } 
}

echo json_encode($result);
?>
