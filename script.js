const categorySelect = document.getElementById("category");
const getButton = document.getElementById("get-button");
const gallery = document.querySelector(".gallery");
const API_URL = "https://api.thecatapi.com";
const API_KEY = "live_X9T9zdeq7DJW5jHAR4GaapoOrlcM971wLcbRIPcf7KFeU5PTgIBQcC5RhSx22Pc1"; // your API key goes here;
const API_category = "https://api.thecatapi.com/v1/categories"; //for retrieving category lists
const API_images = "https://api.thecatapi.com/v1/images/search?limit=9"; //for retrieving images with limit for only 9
const POST_fav = "https://api.thecatapi.com/v1/favourites";//link for posting new favourites
const GET_fav = "https://api.thecatapi.com/v1/favourites?sub_id"; //link for get the favourites
const favo = document.getElementById("get-favourites")//button for get favourites
const removeFav = "https://api.thecatapi.com/v1/favourites/" //link to remove fav

//HARVEND TAURIES
//301251124

// Add your code here
async function getCategories(){
  try{
    //getting category list 
    const category = await fetch(API_category);
    const data = await category.json();
    //append each category element to the dropdown options
    for (let i = 0; i<data.length; i++){
      let opt = document.createElement("option");
      opt.value = data[i].id;
      opt.textContent = data[i].name;
      categorySelect.appendChild(opt);
    }
    
  }
  catch (error){
    console.log(error);
  }
}
async function fetchPic(){
  try{
    //set the gallery to blank 
    gallery.innerHTML="";
    //get the id to specify the category
    const chosen = categorySelect.value;
    //creating the link for retrieving the images
    const categoryURL = API_images + '&category_ids='+chosen;
    //fetch the images and mentioning the api key as headers 
    const response = await fetch(categoryURL, {headers:{'x-api-key':API_KEY}});
    const data = await response.json();
    //append each images to gallery section
    for (let i = 0; i<data.length;i++){
      const divGallery = document.createElement("div");
      //url for the images
      const imgUrl = data[i].url;
      //set the div that just created as the the class of 'gallery-item'
      divGallery.classList.add("gallery-item");
      //set the string to for img tag 
      const catImg = '<img src="' + imgUrl + '"id="' + data[i].id + '">';
      divGallery.innerHTML = catImg;

      gallery.appendChild(divGallery);

      //creating addeventlistener for every div created
      divGallery.addEventListener("click", addToFavourite);

    }

  }
  catch(error){
    console.log(error);
  }
}
//run the function above when the button clicked
getButton.addEventListener("click",fetchPic)

getCategories();
/* Bonus */

/* 
You'll need to append the heart and add an eventlistener to each image parent (div) when you create it. Here is the code to do that. You might have to modify it a bit differently if you used a different variable name.
*/

/* Uncomment below for the bonus, this is the function that will be called when you click each image. I've used e.currentTarget instead of e.target because it's more reliable. I would encourage you to google it and read about it to understand the differences. */

async function addToFavourite(e) {
  //append the 'heart' to current div
  const heart = document.createElement("span");
  heart.classList.add("heart");
  heart.innerHTML = "&#x2764;";
  e.currentTarget.appendChild(heart);
  //toggle the class for the div
  e.currentTarget.classList.toggle("showheart");
  // Add your code here

  try{
    //post the favourites everytime the the specific div/image is clicked
    //get the id name for the current div that is clicked
    const favId = e.currentTarget.firstChild.getAttribute('id');
    //set the method as post, for sending information. Here the content type is mentioned to make sure the thing sended is identified as json
    //within the body, the image_id is mentioned  as favId (the meaning would be it specify that this image with this id will be sent as favourites)
    const Post =  await fetch(POST_fav,{method:'POST',headers:{'x-api-key':API_KEY,'Content-Type': 'application/json'},body: JSON.stringify({ image_id: favId })})
  }
  catch(error){
    console.log(error);
  }
}  
//display favouries when get favourites button is clicked
favo.addEventListener("click",displayFav)


async function displayFav(){
  //displaying the favourites
  gallery.innerHTML="";
  //get all files identified as favourites
  const get = await fetch(GET_fav,{headers:{'x-api-key':API_KEY}});
  const data = await get.json();
  //declare count variable
  let count = 1;
  //loop for displaying 9 latest favourites
  for (let i = data.length-1; count <=9 && i >=0; i--){
    const divGallery = document.createElement("div");
    const imgUrl = data[i].image.url;
    divGallery.classList.add("gallery-item");
    //here the id for the images is set as 'favourites-id' (id = favourites id, because we retrieve from favourites link)
    const catImg = '<img src="' + imgUrl + '"id="' + data[i].id + '">';
    divGallery.innerHTML = catImg;

    gallery.appendChild(divGallery);
    //add eventlistener for every divgallery
    divGallery.addEventListener("click", reFav);
    count++;
  }
}
//function to delete fav when we are in the favourites section
async function reFav(e){
  //get the id from the current images, here the id alr changed to 'favourites-id'
  const remov = e.currentTarget.firstChild.getAttribute('id');
  //create url for deleting specific images with 'remov' as the identifier (remov is integer)
  const removeUrl = removeFav + remov;
  //sending the DELETE command to the server
  const Del =  await fetch(removeUrl,{method:'DELETE',headers:{'x-api-key':API_KEY,'Content-Type': 'application/json'}})

  //reload the page again with the image that just removed to be deleted
  gallery.innerHTML="";
  const get = await fetch(GET_fav,{headers:{'x-api-key':API_KEY}});
  const data = await get.json();
  let count = 1;
  for (let i = data.length-1; count <=9; i--){
    const divGallery = document.createElement("div");
    const imgUrl = data[i].image.url;
    divGallery.classList.add("gallery-item");

    const catImg = '<img src="' + imgUrl + '"id="' + data[i].id + '">';
    divGallery.innerHTML = catImg;

    gallery.appendChild(divGallery);

    divGallery.addEventListener("click", reFav);
    count++;
  }
}

//HARVEND TAURIES
//301251124