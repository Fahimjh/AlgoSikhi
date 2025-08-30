// let linkedListValues = [];

// // UI Elements
// const startBtn = document.getElementById("start-visualization");
// const closeBtn = document.querySelector(".close-btn");
// const container = document.querySelector(".container");
// const valueInput = document.getElementById("value");
// const createBtn = document.querySelector(".crtLinkedListBtn");
// const linkedListOpsBtn = document.querySelector(".linkedListOpsBtn");
// const linkedListContainer = document.getElementById("linkedList");
// const homePgBtn = document.getElementById("homePage");
// const dashBrdBtn = document.getElementById("dashBoard");

// // Pseudocode data for linkedList creation
// const pseudocodeData = {
//     singly: [
//         "FUNCTION createSinglyLinkedList(values)",
//         "  IF values is empty THEN",
//         "    RETURN error",
//         "  END IF",
//         "  head = NULL",
//         "  FOR EACH v IN values",
//         "    CREATE newNode with data = v",
//         "    IF head is NULL THEN",
//         "      head = newNode",
//         "      tail = newNode",
//         "    ELSE",
//         "      tail.next = newNode",
//         "      tail = newNode",
//         "    END IF",
//         "  END FOR",
//         "  RETURN head",
//         "END FUNCTION"
//     ],
//     doubly: [
//         "FUNCTION createDoublyLinkedList(values)",
//         "  IF values is empty THEN",
//         "    RETURN error",
//         "  END IF",
//         "  head = NULL",
//         "  FOR EACH v IN values",
//         "    CREATE newNode with data = v",
//         "    newNode.prev = tail",
//         "    IF head is NULL THEN",
//         "      head = newNode",
//         "    ELSE",
//         "      tail.next = newNode",
//         "    END IF",
//         "    tail = newNode",
//         "  END FOR",
//         "  RETURN head",
//         "END FUNCTION"
//     ],
//     circular: [
//         "FUNCTION createCircularLinkedList(values)",
//         "  IF values is empty THEN",
//         "    RETURN error",
//         "  END IF",
//         "  head = NULL",
//         "  FOR EACH v IN values",
//         "    CREATE newNode with data = v",
//         "    IF head is NULL THEN",
//         "      head = newNode",
//         "      tail = newNode",
//         "    ELSE",
//         "      tail.next = newNode",
//         "      tail = newNode",
//         "    END IF",
//         "  END FOR",
//         "  tail.next = head",
//         "  RETURN head",
//         "END FUNCTION"
//     ],
//     doublyCircular: [
//         "FUNCTION createDoublyCircularLinkedList(values)",
//         "  IF values is empty THEN",
//         "    RETURN error",
//         "  END IF",
//         "  head = NULL",
//         "  FOR EACH v IN values",
//         "    CREATE newNode with data = v",
//         "    newNode.prev = tail",
//         "    IF head is NULL THEN",
//         "      head = newNode",
//         "    ELSE",
//         "      tail.next = newNode",
//         "    END IF",
//         "    tail = newNode",
//         "  END FOR",
//         "  head.prev = tail",
//         "  tail.next = head",
//         "  RETURN head",
//         "END FUNCTION"
//     ]
// };

// let payment=true;
// mark=80;

// function enroll(callback){
//     console.log("payment processing....");
//     setTimeout(function(){
//         if(payment){
//             callback();
//         }
//         else{
//             console.log("Payment unsuccessful");

//         }
//     },2000);
// }
// function Progress(callback){
//     console.log("Learning....");
//     setTimeout(function(){
//         if(mark>=80){
//             callback();
//         }
//         else{
//             console.log("Didn't achieved enough marks");
//         }
//     },3000);
// }
// function Certificate(){
//     setTimeout(function(){
//         console.log("Certified");
//     },1000);
// }

// enroll(function(){
//     Progress(function(){
//         Certificate();
//     })
// })