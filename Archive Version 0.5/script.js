const turnTag = document.getElementById('TurnTag');
const turnTag2 = document.getElementById('TurnTag2');


//! -- Turn Management --
var orangeTurn = true;

var choices_Orange = Array(3,3,3);
var choices_Teal = Array(3,3,3);
var pieceSelected_Orange = 3;
var pieceSelected_Teal = 3;

var mainGridArray = Array(9);

var currentOutlinedSelectedPiece;


//! -- Main Grid --
//* initial setup
FreshGridArray();
UpdateMatchVisuals_Grid();


//* interacting
//clicked grid request
document.querySelectorAll('.Table p').forEach((cell) => {
    cell.addEventListener('click', (event) => {
        const gridIndex_ = Array.from(event.target.parentNode.children).indexOf(event.target);        

        //check if move is valid
        var validMove = false;
        var pieceToInput;
        if (orangeTurn) {
            validMove = CheckValidPieceIsSelectedForPosition(pieceSelected_Orange, choices_Orange, event.target.textContent);
            pieceToInput = GetPieceRep(pieceSelected_Orange);
        }
        else{
            validMove = CheckValidPieceIsSelectedForPosition(pieceSelected_Teal, choices_Teal, event.target.textContent);
            pieceToInput = GetPieceRep(pieceSelected_Teal);
        }


        if (validMove) {
            
            MainGridClicked(event.target, gridIndex_, pieceToInput);
        }

    });
});

function CheckValidPieceIsSelectedForPosition(pieceSelected_, choices_, currentPiece_){
    if (pieceSelected_ === -1) { return false; }
    if (choices_[pieceSelected_] < 1) { return false; }
    //(it has a piece in its hand)
    //does it overide position
    switch (currentPiece_) {
        case "L":
            return false;
        case "M":
            if (pieceSelected_ === 1) {return true;}    //(swopped index order rq)
            return false;
        case "S":
            if (pieceSelected_ < 3) {return true;}
            return false;
        default:
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
    
    console.log(`At ${index_}  | ${mainGridArray[index_]}  =>  ${pieceToInput_}`);
    mainGridArray[index_] = pieceToInput_;

    UpdateMatchVisuals_Grid();
}






//! -- Pieces Board --
document.querySelectorAll('.PiecesBoard').forEach((size) => {
    size.addEventListener('click', (event) => {
        const gridIndex_ = Array.from(event.target.parentNode.parentNode.children).indexOf(event.target.parentNode);        
                

        var colorT = "Orange";
        if (event.currentTarget.id != 'tealSide') {
            pieceSelected_Orange = gridIndex_ + 1;
            orangeTurn = true;
            console.log("got orange side");
        }
        else{
            pieceSelected_Teal = gridIndex_ + 1;
            orangeTurn = false;
            console.log("got teal side");
            colorT = "Teal";
        }

        UpdateVisuals_SelectedPiece(event.target.parentNode, colorT );
        UpdateVisuals_Turn();

    });
});





//! -- Updating Visuals --

function FreshGridArray(){
    for (let i = 0; i < mainGridArray.length; i++) {
        mainGridArray[i] = "-";        
    }
}

function UpdateMatchVisuals_Grid(){
    //foreach visual cell
    document.querySelectorAll('.Table p').forEach((visualCell) => {
        //give it corresponding value from mainGridArray
        const index = Array.from(visualCell.parentNode.children).indexOf(visualCell);        
        visualCell.textContent = mainGridArray[index];
    });
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
    obj___.style.borderColor = colour_;

    if (currentOutlinedSelectedPiece) {    currentOutlinedSelectedPiece.style.borderColor = "";   }

    currentOutlinedSelectedPiece = obj___;
}
