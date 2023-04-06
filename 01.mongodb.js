// A. 기본 문법
// 1 . database 생성
// use database 이름
use blog

// 2 . collection 생성
	db.createCollection("posts");
	
// 3 . insert(객체)
// 1) insertOne()

db.posts.insertOne({
	title: "제목1",
	body: "글상세내용",
	category: "News",
	likes:1,
	tags:["news","events"],
	date: Date()
})


// 2) insertMany()
db.posts.insertMany([
{
	title: "제목2",
	body: "글상세내용",
	category: "News",
	likes:1,
	tags:["news","events"],
	date: Date()
},
{
	title: "제목3",
	body: "글상세내용",
	category: "News",
	likes:1,
	tags:["news","events"],
	date: Date()
},
{
	title: "제목4",
	body: "글상세내용",
	category: "News",
	likes:1,
	tags:["news","events"],
	date: Date()
}
]
)





// 4. Find() 명령 
// 1) find all
db.test.find();

// 2) findOne()
db.posts.findOne();

// 3) 조건
db.posts.find({category:"News"});
db.posts.find({category:"events"});



// 5 . update
// 1) updateOne()
db.posts.find({title:"제목1"});
db.posts.updateOne({title:"제목1"},{$set: {likes:2}});

// 2) updateOne() 후 not found일 경우
db.posts.updateOne({title:"제목5"}
,{$set:
 {title: "[수정]제목5",
	body: "글상세내용",
	category: "Event",
	likes:5,
	tags:["news","events"],
	date: Date()
	}
 },
	{upsert : true} //upsert가 true일 경우 not found라면 insert
 );
db.posts.find();

// 3) updateMany()
db.posts.updateMany({}, {$inc:{likes:1}});
db.posts.find();

// 6 . Delete
// 1) deleteOne()
db.posts.deleteOne({title:"[수정]제목5"});
db.posts.find();




// 2) deleteMany()
db.posts.deleteMany({category:"Event"});
db.posts.find();


/*
  MongDB query operator
	
	1 . 비교연산자
	
	$eq
	$ne
	$gt
	$gte
	$lt
	$lte
	$in
	
	2 . 논리연산자
	
	$and
	$or
	$nor
	$not
	
	3 . Evaluation
	
	$regex
	$text
	$where
	
	
	  MongDB update operator
		
	1 . fields
	
		$currentDate : 날짜필드를 현재일로 수정
		
		$inc				 : 필드값을 증감
		
		$rename		   : 필드이름을 변경
		
		$set		     : 필드값을 수정
		
		$unset       : 필드삭제
		
		
  2 . Array
	
		$addToSet    : 중복되지 않을 경우에만 추가(중복일 경우 추가되지 않음)
		
		$pop         : 처음이나 마지막 요소를 꺼내온 후에 삭제
		
		$super	     : 조건에 일치된 모든 요소를 삭제
		
		$push  	     : 요소를 추가
	
	
*/


// 실습1. inventory라는 collection에 추가
db.createCollection("inventory");

db.inventory.insertMany(
[
    { "item": "journal", "qty": 25, "size": { "h": 14, "w": 21, "uom": "cm" }, "status": "A" },
    { "item": "notebook", "qty": 50, "size": { "h": 8.5, "w": 11, "uom": "in" }, "status": "A" },
    { "item": "paper", "qty": 100, "size": { "h": 8.5, "w": 11, "uom": "in" }, "status": "D" },
    { "item": "planner", "qty": 75, "size": { "h": 22.85, "w": 30, "uom": "cm" }, "status": "D" },
    { "item": "postcard", "qty": 45, "size": { "h": 10, "w": 15.25, "uom": "cm" }, "status": "A" }
]);

// 실습2. select * from inventory where status = 'D';
db.inventory.find({status :"D"});

// 실습3. select * from inventory where status in ('A', 'D');

db.inventory.find({status:{$in:["A","D"]}});


// {$and: [{1st조건}, {2nd조건}]}, {$or: [{1st조건}, {2nd조건}]}
// 실습4. select * from inventory where status = 'A' and qty < 30

db.inventory.find({$and:[{status: "A"}, {qty:{ $lt: 30 }}]});

// 실습5. SELECT * FROM inventory WHERE status = "A" OR qty < 30
db.inventory.find({$or:[{status: "A"}, {qty:{ $lt: 30 }}]})

// 실습6. SELECT * FROM inventory WHERE status = "A" AND ( qty < 30 OR item LIKE "p%")
// {1st조건, $or: [{1st조건}, {2nd조건}]}
// like = $regex: "^p"

db.inventory.find({$or:[{status: "A"},{qty:{$it: 30},
									{item:{$regex: "^p"}}}}); 

db.inventory.find(
{ 
				status: "A",
				$or: [ { qty: { $lt: 30 } },
				 { item: { $regex: "^p" } } 	 
				 ] }) //깨달음

// B . 
// 7 . aggregate 집계
// $group
// $limit
// $project
// $sort
// $match
// $addFields
// $count
// $lookup
// $out
db.posts.find();
db.posts.find().limit(1);

//select title,body from posts linit 1;
db.posts.find({},{_id:0,title:1,body:1}).limit(1);

//select category, sum(likes) from posts group by category;
db.posts.aggregate(
	{$match:{likes:{$gt:1}}},
	{$group:{_id:"$category", totalLikes:{$sum: "$likes"}}}
);


db.listingsAndReviews.find().limit(5);

// 1) $group
// select distinct  property_type from listingsAndReviews;
db.listingsAndReviews.aggregate([{$group: {_id:"$property_type"}}]);

// 2) $limit
db.movies.aggregate([{$limit:1}]);


// 3) $project
db.restaurants.aggregate({$project:{"name":1,"cuisine":1,"address":1}},{$limit:5});

// 4) $sort
// select name,accommodates from order by accommodates desc;

db.listingsAndReviews.aggregate(
{$sort:{"accommodates":-1}}, // asc,desc
{$project:{"name":1,"accommodates":1}},
{$limit:5}
)

// 5) $match
//select name, badroos, price from listingsAndReviews where property_type = 'House' limit 2;
db.listingsAndReviews.aggregate(
	{$match:{property_type:"House"}},
	{$project: {"name":1,"bedrooms":1,"price":1}},
	{$limit:2}

);

// 6) $addFields 새로운 열 추가
db.restaurants.find({},{name:1,avgGrade:1,grades:1});
db.restaurants.aggregate(
{$addFields: {avgGrade:{$avg: "$grades.score"}}},
{$project:{"name":1,"avgGrade":1}},
{$limit:5}
);


// 7) $count
// select count(cuisne) from restaurants where cuisine = 'Chinese';
db.restaurants.aggregate(
	{$match : {"cuisine":"Chinese"}},
	{$count : "totalChinese"}
);

// 8) $lookup(from,localfield, foreignFieldes, as)
// from : 동일 DB안에 lookup할 collection
// localfield : collection에서 unique한 identifier 사용
// foreignFieldes : 참조collection primary필드 (PK)
// as : 새로운 필드명
db.comments.find();

db.comments.aggregate(
{$lookup:{from:"movies",localField: "movie_id",foreignField:"_id",as:"movie_detail"}},
{$limit:5}

);

// 9) $out :
db.listingsAndReviews.aggregate(
{$group:{_id:"$property_type",properties: {$push:{name:"$name",accomodates:"$accomodates",price:"price"}}}},
{$out: "properties_by_type"}

);


// C . embedded / nested
db.embdded.insertMany(
[
    { "item": "journal", "qty": 25, "size": { "h": 14, "w": 21, "uom": "cm" }, "status": "A" },
    { "item": "notebook", "qty": 50, "size": { "h": 8.5, "w": 11, "uom": "in" }, "status": "A" },
    { "item": "paper", "qty": 100, "size": { "h": 8.5, "w": 11, "uom": "in" }, "status": "D" },
    { "item": "planner", "qty": 75, "size": { "h": 22.85, "w": 30, "uom": "cm" }, "status": "D" },
    { "item": "postcard", "qty": 45, "size": { "h": 10, "w": 15.25, "uom": "cm" }, "status": "A" }
]);

db.embdded.find();

db.embdded.find({},{size:{w:21,h:14,uom:'cm'}});
db.embdded.find({},{"size.uom":'in'});

//실습 h < 15 선택
db.embdded.find({"size.h":{$lt: 15}});

//실습 h < 15 and uom = in and status = D
db.embdded.find({"size.h":{$lt: 15},"size.uom":'in',status:"D"});

// collection 완전삭제
db.inventory.drop();


// D . Array
db.inventory.insertMany([
   { item: "journal", qty: 25, tags: ["blank", "red"], dim_cm: [ 14, 21 ] },
   { item: "notebook", qty: 50, tags: ["red", "blank"], dim_cm: [ 14, 21 ] },
   { item: "paper", qty: 100, tags: ["red", "blank", "plain"], dim_cm: [ 14, 21 ] },
   { item: "planner", qty: 75, tags: ["blank", "red"], dim_cm: [ 22.85, 30 ] },
   { item: "postcard", qty: 45, tags: ["blue"], dim_cm: [ 10, 15.25 ] }
]);

db.inventory.find();
db.inventory.find({tags: ["red", "blank"]});
db.inventory.find({tags: {$all:["red", "blank"]}});

db.inventory.find({tags: "red"});
db.inventory.find({tags: "blue"});

db.inventory.find({dim_cm: {$gt:25}});

db.inventory.find({dim_cm: {$gt:22, $lt:30}});
db.inventory.find({dim_cm: {$elemMatch:{$gt:22, $lt:30}}});


// index position
	db.inventory.find({"dim_cm.1":{$gt:25}});
// array length
db.inventory.find({"tags":{$size:3}});
db.inventory.find({"tags":{$size:2}});


// array nested
db.inventory.drop();
db.inventory.insertMany([
   { item: "journal", instock: [ { warehouse: "A", qty: 5 }, { warehouse: "C", qty: 15 } ] },
   { item: "notebook", instock: [ { warehouse: "C", qty: 5 } ] },
   { item: "paper", instock: [ { warehouse: "A", qty: 60 }, { warehouse: "B", qty: 15 } ] },
   { item: "planner", instock: [ { warehouse: "A", qty: 40 }, { warehouse: "B", qty: 5 } ] },
   { item: "postcard", instock: [ { warehouse: "B", qty: 15 }, { warehouse: "C", qty: 35 } ] }
]);

db.inventory.find();

db.inventory.find(
{"instock":{warehouse:"A", qty:5}}
);

db.enableFreeMonitoring(); // <-- 몽고컴파스에서만 가능 주소카피해서 사용하면 됨

//instock qty <= 20    $elemMatch <-- 순서에 상관없음


db.inventory.find(
{"instock.qty":{$gte:20}}
);


db.inventory.find(
{"instock.qty":{$gt:10, $lte:20}}
);


// E . JavaScript 사용
for(let i=0; i<100; i++){
	db.javascript.insertOne({userid:'user' + i, name : '홍길동'+i});
}
db.javascript.find().limit(5).sort({userid:-1});



// cursor - BSON > tojson
let myCursor = db.javascript.find().limit(5).sort({userid:-1});

while(myCursor.hasNext()) {
 print(tojson(myCursor.next()));
}


// cursor BSON > toArray;

let docArray = myCursor.toArray();
print(docArray[3]);


// F . mapreduce
db.orders.insertMany([
   { _id: 1, cust_id: "Ant O. Knee", ord_date: new Date("2020-03-01"), price: 25, items: [ { sku: "oranges", qty: 5, price: 2.5 }, { sku: "apples", qty: 5, price: 2.5 } ], status: "A" },
   { _id: 2, cust_id: "Ant O. Knee", ord_date: new Date("2020-03-08"), price: 70, items: [ { sku: "oranges", qty: 8, price: 2.5 }, { sku: "chocolates", qty: 5, price: 10 } ], status: "A" },
   { _id: 3, cust_id: "Busby Bee", ord_date: new Date("2020-03-08"), price: 50, items: [ { sku: "oranges", qty: 10, price: 2.5 }, { sku: "pears", qty: 10, price: 2.5 } ], status: "A" },
   { _id: 4, cust_id: "Busby Bee", ord_date: new Date("2020-03-18"), price: 25, items: [ { sku: "oranges", qty: 10, price: 2.5 } ], status: "A" },
   { _id: 5, cust_id: "Busby Bee", ord_date: new Date("2020-03-19"), price: 50, items: [ { sku: "chocolates", qty: 5, price: 10 } ], status: "A"},
   { _id: 6, cust_id: "Cam Elot", ord_date: new Date("2020-03-19"), price: 35, items: [ { sku: "carrots", qty: 10, price: 1.0 }, { sku: "apples", qty: 10, price: 2.5 } ], status: "A" },
   { _id: 7, cust_id: "Cam Elot", ord_date: new Date("2020-03-20"), price: 25, items: [ { sku: "oranges", qty: 10, price: 2.5 } ], status: "A" },
   { _id: 8, cust_id: "Don Quis", ord_date: new Date("2020-03-20"), price: 75, items: [ { sku: "chocolates", qty: 5, price: 10 }, { sku: "apples", qty: 10, price: 2.5 } ], status: "A" },
   { _id: 9, cust_id: "Don Quis", ord_date: new Date("2020-03-20"), price: 55, items: [ { sku: "carrots", qty: 5, price: 1.0 }, { sku: "apples", qty: 10, price: 2.5 }, { sku: "oranges", qty: 10, price: 2.5 } ], status: "A" },
   { _id: 10, cust_id: "Don Quis", ord_date: new Date("2020-03-23"), price: 25, items: [ { sku: "oranges", qty: 10, price: 2.5 } ], status: "A" }
])
db.orders.find();

let mapFunction1 = function()  {
	emit(this.cust_id,this.price);
}

let reduceFunction1 = function(keyCustid,valuesPrices){
	return Array.sum(valuesPrices);
}

db.orders.mapReduce(mapFunction1, reduceFunction1, {out:"map_reduce_result"});


db.map_reduce_result.find().sort({_id:1});

// 삭제
// 1 . collection
db.컬렉션명.drop()

// 2 . database 삭제
db.dropDatabase("mydb");
show database





