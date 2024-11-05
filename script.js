const turnTag = document.getElementById('TurnTag');
const turnTag2 = document.getElementById('TurnTag2');



//! -- Turn Management --
var orangeTurn = true;

var choices_Orange = Array(3,3,3);
var choices_Teal = Array(3,3,3);
var pieceSelected_Orange = -1;
var pieceSelected_Teal = -1;

var mainGridArray = Array(9);           //tracks what piece
var mainGridArrayColour = Array(9);     //tracks what colour

var currentOutlinedSelectedPiece;


//! -- Main Grid --
//* initial setup
document.querySelectorAll('.Table p').forEach((cell) => {
    cell.addEventListener('click', ClickGridRequest);
});
FreshGridArray();
UpdateMatchVisuals_Grid();


//* interacting
// //clicked grid request
// document.querySelectorAll('.Table p').forEach((cell) => {
//     cell.addEventListener('click', (event) => {
//         const gridIndex_ = Array.from(event.target.parentNode.children).indexOf(event.target);        

//         //check if move is valid
//         var validMove = false;
//         var pieceToInput;
//         if (orangeTurn) {
//             validMove = CheckValidPieceIsSelectedForPosition(pieceSelected_Orange, choices_Orange, event.target.textContent);
//             pieceToInput = GetPieceRep(pieceSelected_Orange);
//         }
//         else{
//             validMove = CheckValidPieceIsSelectedForPosition(pieceSelected_Teal, choices_Teal, event.target.textContent);
//             pieceToInput = GetPieceRep(pieceSelected_Teal);
//         }


//         console.log(validMove + "Valid");
//         if (validMove) {
            
//             MainGridClicked(event.target, gridIndex_, pieceToInput);
//         }

//     });
// });


//clicked grid request
function ClickGridRequest(event) {
        const gridIndex_ = Array.from(event.target.parentNode.children).indexOf(event.target);        

        //check if move is valid
        var validMove = false;
        var pieceToInput;

        var turn_;
        var pieceSel_;
        
        if (orangeTurn) {
            validMove = CheckValidPieceIsSelectedForPosition(pieceSelected_Orange, choices_Orange, event.target.classList);
            pieceToInput = GetPieceRep(pieceSelected_Orange);
            pieceSel_ = pieceSelected_Orange;
        }
        else{
            validMove = CheckValidPieceIsSelectedForPosition(pieceSelected_Teal, choices_Teal, event.target.classList);
            pieceToInput = GetPieceRep(pieceSelected_Teal);
            pieceSel_ = pieceSelected_Teal;
        }
        turn_ = orangeTurn;


        console.log(validMove + "Valid");
        if (validMove) {
        
            MainGridClicked(event.target, gridIndex_, pieceToInput);
            ReduceAmmo(turn_, pieceSel_);            

        }

};

function CheckValidPieceIsSelectedForPosition(pieceSelected_, choices_, currentPiece_){
    if (pieceSelected_ === -1) { return false; }
    console.log(choices_ + " " + pieceSelected_);
    if (choices_[pieceSelected_-1] <= 0) { return false; }
    //(it has a piece in its hand)
    //does it overide position
    switch (currentPiece_[0]) {
        case "CupLarge":
            return false;
        case "CupMedium":
            if (pieceSelected_ === 1) {return true;}    //(swopped index order rq)
            return false;
        case "CupSmall":
            if (pieceSelected_ < 3) {return true;}
            return false;
        default:
            console.log(currentPiece_[0]);
            return true;
    }


}
function GetPieceRep(index__){
    switch (index__) {
        case 3:
            return "S";
        case 2:
            return "M";
        case 1:
            return "L";
    
        default:
            return "NoneSelected";
    }
}

//clicked grid function
function MainGridClicked(obj_, index_, pieceToInput_){
    
    //console.log(`At ${index_}  | ${mainGridArray[index_]}  =>  ${pieceToInput_}`);
    mainGridArray[index_] = pieceToInput_;
    mainGridArrayColour[index_] = orangeTurn;

    orangeTurn = !orangeTurn;

    UpdateMatchVisuals_Grid();
    UpdateVisuals_SelectedPiece(null, null );
    UpdateVisuals_Turn();

    // //reasign function on clicks after replacing
    // document.querySelectorAll('.Table p').forEach((cell) => {
    //     cell.addEventListener('click', ClickGridRequest);
    // });
}

function ReduceAmmo(orangeTurn_, pieceToInput_){
    console.log(pieceToInput_ + " " + orangeTurn_)
    let array = choices_Orange;
    if (!orangeTurn_) { array = choices_Teal; }

    switch (pieceToInput_) {
        case 3:    //S  
            array[2] -= 1;
            break;
        case 2:     //M  
            array[1] -= 1;
            break;
        case 1:      //L 
            array[0] -= 1;
            break;
    
        default:
            console.log("Invalid piece type. - " + pieceToInput_);
            break;
    }
    UpdateVisualAmmo();
}
function UpdateVisualAmmo(){

    AmmoSubFunction(choices_Orange[2], document.getElementById("orangeSide").children[2])
    AmmoSubFunction(choices_Orange[1], document.getElementById("orangeSide").children[1])
    AmmoSubFunction(choices_Orange[0], document.getElementById("orangeSide").children[0])
    AmmoSubFunction(choices_Teal[2], document.getElementById("tealSide").children[2])
    AmmoSubFunction(choices_Teal[1], document.getElementById("tealSide").children[1])
    AmmoSubFunction(choices_Teal[0], document.getElementById("tealSide").children[0])


}
function AmmoSubFunction(valueToShow_, parentHolder_){
    console.log("## Value to show:", valueToShow_);
    console.log("## Parent holder:", parentHolder_);
    
    for (let i = 0; i < parentHolder_.children.length; i++) {
        
        if (i > valueToShow_-1) {
            parentHolder_.children[i].style.display = "none";
            console.log(valueToShow_ + " " + parentHolder_.children[i].style.display);

        }
        else{
            console.log(parentHolder_.children[i].style.display);
            parentHolder_.children[i].style.display = "";

        }
        
    }
    
}






//! -- Pieces Board --
document.querySelectorAll('.PiecesBoard').forEach((size) => {
    size.addEventListener('click', (event) => {
        const gridIndex_ = Array.from(event.target.parentNode.children).indexOf(event.target);        
                
        //console.log(event.target);

        var colorT = "Orange";
        if (event.currentTarget.id != 'tealSide') {
            pieceSelected_Orange = gridIndex_ + 1;
            orangeTurn = true;
            //console.log("got orange side " + pieceSelected_Orange + "    " + event.target.classList);
        }
        else{
            pieceSelected_Teal = gridIndex_ + 1;
            orangeTurn = false;
            //console.log("got teal side " + pieceSelected_Teal + "    " + event.target.classList);
            colorT = "Teal";
        }

        UpdateVisuals_SelectedPiece(event.target, colorT );
        UpdateVisuals_Turn();

    });
});





//! -- Updating Visuals --

function FreshGridArray(){
    for (let i = 0; i < mainGridArray.length; i++) {
        mainGridArray[i] = "-";    
        mainGridArrayColour[i] = "-";    

    }
}

function UpdateMatchVisuals_Grid(){
    //foreach visual cell
    document.querySelectorAll('.Table p').forEach((visualCell) => {
        //give it corresponding value from mainGridArray
        var index = Array.from(visualCell.parentNode.children).indexOf(visualCell);        

        // console.log(mainGridArray[index])

        var item_id = "Blank"
        
        switch (mainGridArray[index]) {

            case "S":
                visualCell.textContent = "SS";
                item_id = mainGridArrayColour[index] ? "OrangeSmall" : "TealSmall";
                break;
            case "M":
                visualCell.textContent = "MM";
                if (mainGridArrayColour[index]) { item_id = "OrangeMedium"}
                else { item_id = "TealMedium" }
                break;
            case "L":
                visualCell.textContent = "LL";
                if (mainGridArrayColour[index]) { item_id = "OrangeLarge"}
                else { item_id = "TealLarge" }
                break;
        
            default:                
                break;

                // var toReplace_ = visualCell;
                // var clone_ = document.getElementById("TealSmall");
                // // visualCell = document.getElementById("TealSmall");

                // visualCell.parentElement.replaceChild(clone_, toReplace_)
                // break;
        }
        replaceCellWithClone(visualCell, document.getElementById(item_id))

        


    });


    document.querySelectorAll('.Table p').forEach((cell) => {
         cell.addEventListener('click', ClickGridRequest);
    });
}
function replaceCellWithClone(target_, replaceWith_) {
    // // Select the element to clone (your template or example)
    // var exampleElement = replaceWith_;

     // Clone the example element (true for deep cloning with children)
     var clonedElement = replaceWith_.cloneNode(true);
     clonedElement.removeAttribute('id');
     clonedElement.style.display = ""; // Show the clone if the example was hidden

    // // Select the target cell to replace
    // var targetCell = target_;

    // Replace the target cell with the cloned element
    target_.replaceWith(clonedElement);

}

function UpdateVisuals_Turn(){
    turnTag2.style.display = "none";

    if (orangeTurn) {
        turnTag.textContent = "Orange";
        turnTag.style.color = "Orange";
    } else{
        turnTag.textContent = "Teal";
        turnTag.style.color = "Teal";

    }
}

function UpdateVisuals_SelectedPiece(obj___, colour_){
    
    if (currentOutlinedSelectedPiece) {    currentOutlinedSelectedPiece.style.borderColor = "";   }

    if (obj___ != null) {
        obj___.style.borderColor = colour_;
        currentOutlinedSelectedPiece = obj___;
        
    }
}


