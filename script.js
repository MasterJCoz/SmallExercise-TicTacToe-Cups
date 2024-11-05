// Referencing the turn lable items 
const turnTag = document.getElementById('TurnTag');
const turnTag2 = document.getElementById('TurnTag2');



//!  Logic structor:
//!     User has pieces to select from, can select at any time any avalible pieces represented
//!     User can select a place on Main Table to generate a representing copy of the piece selected
//!         Checks if move is legal, if so,
//!             update grid array, 
//!             decrement players avalible piece choices
//!             deselect item
//!             set turn lable to suggest others players turn
//!             align visual representatives ( .Table with correct colour and size piece  &  .PieceBoard with avalible pieces for correct player )




//! -- Turn Management --
var orangeTurn = true;                  // whos turn

var choices_Orange = Array(3,3,3);      // pieces choices avalible, orange/teal
var choices_Teal = Array(3,3,3);        // ^
var pieceSelected_Orange = -1;          // currently selected piece, orange/teal
var pieceSelected_Teal = -1;            // ^

var mainGridArray = Array(9);           // tracks piece sizes placed
var mainGridArrayColour = Array(9);     // tracks colour of items

var currentOutlinedSelectedPiece;       // last selected piece for reference (for unbordering)



//! ------ Main Grid ------
//* initial setup
document.querySelectorAll('.Table p').forEach((cell) => {
    cell.addEventListener('click', ClickGridRequest);
});
FreshGridArray();
UpdateMatchVisuals_Grid();


//* interacting
//  clicked .Table request - Check if move is valid
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

        if (validMove) {
            MainGridClicked(event.target, gridIndex_, pieceToInput);
            ReduceAmmo(turn_, pieceSel_);            
        }

};
function CheckValidPieceIsSelectedForPosition(pieceSelected_, choices_, currentPiece_){
    // Piece selected check
    if (pieceSelected_ === -1) { return false; }
    if (choices_[pieceSelected_-1] <= 0) { return false; }
    

    //* does it overide piece in requested position
    // (colour doesnt matter only size, (player can overide own smaller piece))
    switch (currentPiece_[0]) {
        case "CupLarge":
            return false;
        case "CupMedium":
            if (pieceSelected_ === 1) {return true;}    
            return false;
        case "CupSmall":
            if (pieceSelected_ <= 2) {return true;}
            return false;
        default:            
            return true;
    }
    //ToDo-   arrays and visual arrays have to be cross referenced at times
    //ToDo-   CupLarge  ===  L  ===  1      
    //ToDo-   CupMedium ===  M  ===  2
    //ToDo-   CupSmall  ===  S  ===  3
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



//* Carry out legal Move
function MainGridClicked(obj_, index_, pieceToInput_){
    
    // update actual data trackers
    mainGridArray[index_] = pieceToInput_;
    mainGridArrayColour[index_] = orangeTurn;

    orangeTurn = !orangeTurn;

    // align visuals with new data
    UpdateMatchVisuals_Grid();
    UpdateVisuals_SelectedPiece(null, null );
    UpdateVisuals_Turn();

}



//* Change pieces avalible to the player
function ReduceAmmo(orangeTurn_, pieceToInput_){

    // get 'pieces avalible array' for player requested
    let array = choices_Orange;
    if (!orangeTurn_) { array = choices_Teal; }

    // translate what piece was used, and decrement 
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

    // visualy align with new data
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

    // display === hide/show  to represent value
    for (let i = 0; i < parentHolder_.children.length; i++) {
        
        if (i > valueToShow_-1) {
            parentHolder_.children[i].style.display = "none";
        }
        else{
            parentHolder_.children[i].style.display = "";
        }
        
    }
}






//! ------ Pieces Board ------
//*  On Click, select correlating piece
document.querySelectorAll('.PiecesBoard').forEach((size) => {
    size.addEventListener('click', (event) => {
        const gridIndex_ = Array.from(event.target.parentNode.children).indexOf(event.target);        
                

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

        // visually match data
        UpdateVisuals_SelectedPiece(event.target, colorT );
        UpdateVisuals_Turn();

    });
});





//! ------ Updating Visuals ------


function FreshGridArray(){
    for (let i = 0; i < mainGridArray.length; i++) {
        mainGridArray[i] = "-";    
        mainGridArrayColour[i] = "-";    
    }
}


//*  Visual '.Table' to match 'mainGridArray' & 'mainGridArrayColour' data
function UpdateMatchVisuals_Grid(){
    // foreach visual cell
    document.querySelectorAll('.Table p').forEach((visualCell) => {
        var index = Array.from(visualCell.parentNode.children).indexOf(visualCell);        

        
        // give it corresponding visual from mainGridArray value
        var item_id = "Blank"
        switch (mainGridArray[index]) {

            case "S":
                //// visualCell.textContent = "SS";
                item_id = mainGridArrayColour[index] ? "OrangeSmall" : "TealSmall";
                break;
            case "M":
                //// visualCell.textContent = "MM";
                if (mainGridArrayColour[index]) { item_id = "OrangeMedium"}
                else { item_id = "TealMedium" }
                break;
            case "L":
                //// visualCell.textContent = "LL";
                if (mainGridArrayColour[index]) { item_id = "OrangeLarge"}
                else { item_id = "TealLarge" }
                break;
        
            default:                
                break;

                //// (text.content was for debugging)
        }


        //*  Copy clone of representative piece, and place in requested position (if not blank)
        replaceCellWithClone(visualCell, document.getElementById(item_id))

    });

    // make sure all new clones/pieces are correctly interactable
    document.querySelectorAll('.Table p').forEach((cell) => {
         cell.addEventListener('click', ClickGridRequest);
    });
}
function replaceCellWithClone(target_, replaceWith_) {
     // Clone the example element (true for deep cloning with children)
     var clonedElement = replaceWith_.cloneNode(true);
     clonedElement.removeAttribute('id');
     clonedElement.style.display = ""; // Show the clone (may be hidden)

    // Replace the target cell with the cloned element
    target_.replaceWith(clonedElement);
}


//* update turn text
function UpdateVisuals_Turn(){
    turnTag2.style.display = "none";    //starting text off

    if (orangeTurn) {
        turnTag.textContent = "Orange";
        turnTag.style.color = "Orange";
    } else{
        turnTag.textContent = "Teal";
        turnTag.style.color = "Teal";

    }
}

//* deselect old selection, give new selection border
function UpdateVisuals_SelectedPiece(obj___, colour_){
    
    if (currentOutlinedSelectedPiece) {    currentOutlinedSelectedPiece.style.borderColor = "";   }

    if (obj___ != null) {
        obj___.style.borderColor = colour_;
        currentOutlinedSelectedPiece = obj___;
        
    }
}


