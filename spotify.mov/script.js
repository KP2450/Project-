console.log("Lets write Javascript");
let currentSong=new Audio();
let songs;
let currFolder;


function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
      return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder){
  currFolder=folder;
  let a=await fetch(`/${folder}/`)

  let response=await a.text();

  let div=document.createElement("div");
  div.innerHTML=response;
 let as= div.getElementsByTagName("a");
 songs=[];
 for (let index = 0; index < as.length; index++) {
  const element = as[index];
  if(element.href.endsWith(".mp3")){
    songs.push(element.href.split(`/${folder}/`)[1]);
  }
 }
  //show all the songs in the playlist 
  let songUL=document.querySelector(".songlist").getElementsByTagName("ul")[0]
  
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML=songUL.innerHTML + `<li>  
 
                <img class="invert" src="music.svg" alt="">
                <div class="info">
                  <div>    ${song.replaceAll("%20", " ")}</div>
                  <div>Kalpak</div>
                </div>
                <div class="playnow">
                  <span>Play now</span>
                  <img class="invert" src="play.svg" alt="">
                </div>
      </li>`;
    
  }
  //Atta
Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
  e.addEventListener("click",element=>{
  playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
})
})
 return songs;
}
const playMusic=(track,pause=false)=>{
  currentSong.src=`/${currFolder}/`+track; 
  if(!pause){
  currentSong.play();
  play.src="pause.svg";
  }
 

  
  document.querySelector(".songinfo").innerHTML=decodeURI(track)
  document.querySelector(".songtime").innerHTML="00:00 / 00:00 "

  
}
async function displayAlbums() {
  console.log("displaying albums");

  let a = await fetch(`/songs/`);
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;

  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");
  let array = Array.from(anchors);

  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
      let folder = e.href.split("/").slice(-2)[0];

      try {
        // Fetch metadata
        let infoRes = await fetch(`/songs/${folder}/info.json`);
        if (!infoRes.ok) continue;
        let metadata = await infoRes.json();

        // Create card element
        let card = document.createElement("div");
        card.className = "card";
        card.dataset.folder = folder;

        card.innerHTML = `
          <div class="play">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                stroke-linejoin="round" />
            </svg>
          </div>
          <img src="/songs/${folder}/cover.jpg" alt="">
          <h2>${metadata.title}</h2>
          <p>${metadata.description}</p>
        `;

        // Add click listener to the card
        card.addEventListener("click", async (item) => {
          console.log("Fetching Songs from", card.dataset.folder);
          let songs = await getSongs(`songs/${card.dataset.folder}`);
          playMusic(songs[0]);
        });

        // Add card to container
        cardContainer.appendChild(card);
      } catch (err) {
        console.error(`Error loading album ${folder}:`, err);
      }
    }
  }
}

 
async function main(){
 

   //get the list of all song
await getSongs("songs/cs");
playMusic(songs[0],true)
 //Display all the  albums on the page
 displayAlbums()
play.addEventListener("click",()=>{
  if(currentSong.paused){
    currentSong.play();
  play.src="pause.svg";
  }
  else{
    currentSong.pause();
    play.src="play.svg";
  }
})
//listen for time update event
currentSong.addEventListener("timeupdate",()=>{
  console.log(currentSong.currentTime,currentSong.duration);
  document.querySelector(".songtime").innerHTML=`${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
  document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100+"%";
})
//add an event listener to seek bar
document.querySelector(".seekbar").addEventListener("click",e=>{
  let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
  document.querySelector(".circle").style.left=percent+"%";
  currentSong.currentTime=((currentSong.duration)*percent)/100;

})
//Add an event listener for hamburger
document.querySelector(".hamburger").addEventListener("click",()=>{
  document.querySelector(".left").style.left= "0";
})
//for close button
document.querySelector(".close").addEventListener("click",()=>{
  document.querySelector(".left").style.left= "-120%";
})
//Add an event listener to previous and next
previous.addEventListener("click",()=>{
  console.log("Previous clicked");

  let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])

if((index-1)>=0){
  playMusic(songs[index-1])

}
})
next.addEventListener("click",()=>{
console.log("Next click");
let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])

if((index+1)<songs.length){
  playMusic(songs[index+1])

} 


})
//Add an event to volume
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
  console.log("Setting volume to",e.target.value,"/100");
  currentSong.volume = parseInt(e.target.value)/100;
  if (currentSong.volume>0){
    document.querySelector(".volume>img").src=document.querySelector(".volume>img").src.replace("mute.svg","volume.svg")
  }






})
//Load the playlist whenever card is clicked
Array.from(document.getElementsByClassName(" card")).forEach(e=>{
  console.log(e);
  e.addEventListener("click",async item=>{
   console.log("Fetching Songs")
    songs= await getSongs(`songs/${item.currentTarget.dataset.folder}`)
  

  })
})
//Add event listener to the track
 document.querySelector(".volume>img").addEventListener("click",e=>{
  console.log(e.target)
console.log("changing",e.target.src)
if(e.target.src.includes("volume.svg")){
  e.target.src=e.target.src.replace("volume.svg","mute.svg")
currentSong.volume=0;
document.querySelector(".range").getElementsByTagName("input")[0].value=0;
}
else{
  e.target.src=e.target.src.replace("mute.svg","volume.svg")
  currentSong.volume=.10;
  document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
} 
 })
}
main();
