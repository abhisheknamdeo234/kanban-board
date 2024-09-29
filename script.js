const addbtn = document.querySelector(".add-btn");
const removebtn = document.querySelector(".remove-btn");
const modalCont = document.querySelector(".modal-cont");
const textareaCont = document.querySelector(".textarea-cont");
const ticketareaCont = document.querySelector(".ticket-area");
const prioritycolor = document.querySelectorAll(".priority-color");
const ticketCont = document.querySelectorAll(".ticket-cont");

const ticketArr = JSON.parse(localStorage.getItem("tickets")) || [];




//adding event listener to show hide functionality

let taskFlag  = false;
let removeFlag = false;
addbtn.addEventListener('click',()=>{
    taskFlag = !taskFlag;
    if(taskFlag){
        modalCont.style.display='flex';
    }else{
        modalCont.style.display='none';
    }
})
 
// creating ticket
function createTicket(TicketId,TicketareaTask,modalprioritycolor){
    const ticketcont = document.createElement("div");
    ticketcont.classList.add("ticket-cont");
    

    ticketcont.innerHTML =
            ` <div class="ticket-color" style="background-color:${modalprioritycolor}" ></div>
            <div class="ticket-id">${TicketId}</div>
            <div class="ticket-area">${TicketareaTask}
            </div>
            <div class="ticket-lock">
                <i class="fa-solid fa-lock"></i>
            </div> `
    ;
    const mainCont = document.querySelector(".main-cont");
    mainCont.appendChild(ticketcont);
    handlelock(ticketcont);
    handlecolor(ticketcont);
    
}

let modalprioritycolor ="black";
modalCont.addEventListener("keydown",(ev)=>{
    if(ev.key==="Shift"){
        const TicketareaTask = textareaCont.value; 
        const TicketId = Math.random().toString(36).substring(2,9);
        
        
        createTicket(TicketId,TicketareaTask,modalprioritycolor);
        
        modalCont.style.display="none"; //closing modal after pressing sift
        textareaCont.value = ''; //making textarea blank after close
        ticketArr.push({
        ticketID:TicketId,
        ticketColor:modalprioritycolor,
        taskContent:TicketareaTask
        
    });
    updateLocalStorage();
}



})


prioritycolor.forEach((ele)=>{
    ele.addEventListener("click",(ev)=>{

        prioritycolor.forEach((ele)=>{
                ele.classList.remove("active");
        })
        ev.target.classList.add("active");
        modalprioritycolor= ev.target.getAttribute('data-color');
    })
 });
        //adding remove button functionality
 

removebtn.addEventListener('click',(ev)=>{
    const ticketCont = document.querySelectorAll(".ticket-cont");
    removeFlag = !removeFlag;
    if(removeFlag==true){
        alert("Remove button has been activated");
        removebtn.style.color="red";
    }else{
        removebtn.style.color="white";

    }
    handleRemovebtn(ticketCont);
   
})

function handleRemovebtn(ticketElem){
    
    ticketElem.forEach((ele)=>{
        const id = ele.querySelector(".ticket-id").innerText;
        ele.addEventListener('click',()=>{
            if(removeFlag===true){
                ele.remove();

            }
                const ticketidxx = getTicketIdx(id);
                ticketArr.splice(ticketidxx,1);
                updateLocalStorage();
        })
    })
}

const lockicon = document.querySelector(".fa-lock");
const unlockicon = document.querySelector(".fa-lock-open");


function handlelock(ticketcont){
    const ticketlockCont = ticketcont.querySelector(".ticket-lock");
    const ticketarea = ticketcont.querySelector(".ticket-area");
    const id = ticketcont.querySelector(".ticket-id").innerText;
    ticketlockCont.addEventListener("click",()=>{
        console.log("clicked");

        const ticketIdxx=getTicketIdx(id);//id for localstroage update

        if(ticketlockCont.children[0].classList.contains("fa-lock")){
            ticketlockCont.children[0].classList.remove("fa-lock")
            ticketlockCont.children[0].classList.add("fa-lock-open")

            ticketarea.setAttribute('contenteditable',"true");
        }
        else {
            ticketlockCont.children[0].classList.remove("fa-lock-open")
            ticketlockCont.children[0].classList.add("fa-lock")
            ticketarea.setAttribute('contenteditable',"false");
        }

        ticketArr[ticketIdxx].taskContent = ticketarea.innerText;
    updateLocalStorage();// localstorage update
    })
    
    
    }
    let colorarray = ["lightpink","lightgreen","lightblue","black"]

function handlecolor(ticketcont){
    const ticketcolor = ticketcont.querySelector(".ticket-color");
    const id = ticketcont.querySelector(".ticket-id").innerText;

    
    ticketcolor.addEventListener("click",()=>{
        const currentcolor = ticketcolor.style.backgroundColor;

        const ticketIdxx = getTicketIdx(id);
        console.log(ticketIdxx,"ticketcountishere");
        

        const currentcolorInd = colorarray.findIndex((color)=>{
            return color === currentcolor;
        })
            console.log(currentcolorInd,currentcolor,colorarray);
            // this is for color changing and stoping overflow
            const newColorIndex= (currentcolorInd + 1) % colorarray.length;
            const newcolor = colorarray[newColorIndex];
            ticketcolor.style.backgroundColor=newcolor;

            ticketArr[ticketIdxx].ticketColor=newcolor;//updating changed color
            updateLocalStorage();
    })
        // console.log("clicked",colorarray);
       
       
} 
// applying color filter
const toolboxColor = document.querySelectorAll(".color");

toolboxColor.forEach((colorElem)=>{
    colorElem.addEventListener('click',()=>{
        console.log("clicked")
        const selectedColor=colorElem.classList[0]; 
        // console.log(selectedColor)

        const alltickets = document.querySelectorAll(".ticket-cont");

        alltickets.forEach((ticketElem)=>{
            const ticketcolorband = ticketElem.querySelector(".ticket-color");
           
            const currentcolor = ticketcolorband.style.backgroundColor;
            console.log(currentcolor)
            
            if(currentcolor===selectedColor){
                ticketElem.style.display="block";
            }else{
                ticketElem.style.display="none";
            }
        })
    })
    colorElem.addEventListener('dblclick',()=>{
        const alltickets = document.querySelectorAll(".ticket-cont");

        alltickets.forEach((ticketElem)=>{
            ticketElem.style.display="block";
        })

    })
})

function updateLocalStorage(){
    localStorage.setItem("tickets",JSON.stringify(ticketArr));
}

function getTicketIdx(id){

    let ticketIdx = ticketArr.findIndex(function(ticketObj){
        return ticketObj.ticketID===id;
    })
    return ticketIdx;

}

function initialise(){

    // to retrieve all tickets from local storage 
    if(localStorage.getItem("tickets")){
        for(let i=0;i<ticketArr.length;i++){
            createTicket(ticketArr[i].ticketID,ticketArr[i].taskContent,ticketArr[i].ticketColor);
            
        }
    }
}

initialise();





   


        
        

