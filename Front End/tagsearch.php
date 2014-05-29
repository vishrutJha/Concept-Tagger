<?php

$m=new MongoClient();
$db=$m->Crawler;
$coll=$db->Domains;

if(isset($_REQUEST["q"])){
	$query = $_REQUEST["q"];
	$cur = $coll->find(array("Domain" => new MongoRegex("/$query/i")));

	$tags = explode(" ", $query);
} else {
	$cur = $coll->find();
}

$result = array();

foreach($cur as $item){
	$par_res = array();
	$par_res["domain"] = $item["Domain"];
	if(isset($item["tags"])){
		$par_res["tags"] = $item["tags"];
	} else {
		$par_res["tags"] = [];
	}
	$result[] = $par_res;
}

echo json_encode($result);
?>
