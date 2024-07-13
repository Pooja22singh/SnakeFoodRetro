const init = () => {
    let direction = "right";
    let gameInterval;
    let gameSpeedDelay = 200;
    let gameStarted = false;
    let gridSize = 20;
    let startState = document.querySelector(".startState");
    let gameBoard = document.querySelector(".gameBoard");
    let foodPos = generateRandomPosition();
    let snake = [{ row: 10, column: 10 }];
    let currScore = 0;
    let highScore = window.localStorage.getItem("highScore") || 0;
    const currentScoreDOM = document.querySelector(".currScore");
    const highestScoreDOM = document.querySelector(".highScore");
    const board = document.querySelector(".board");
    const audio = new Audio("./gameover.wav");

    function generateRandomPosition  () {
        /**
         * The Math.random() static method returns a floating-point, pseudo-random number that's greater than or equal to 0 and less than 1
         * so min 0 and max 0.99 so row/column min is 1 and row/column max is 20.8 so 20
         */
        let row = Math.floor(Math.random() * gridSize) + 1;
        let column = Math.floor(Math.random() * gridSize) + 1;
        if (row === 1) row += 1;
        if (column === 1) column += 1;
        if (row === gridSize) row = row - 1;
        if (column === gridSize) column = column - 1;
        return { row, column }
    }

    const drawFood = () =>{
        let food = document.createElement("p");
        food.className = "food";
        food.style.height = "20px";
        food.style.width = "20px";
        food.style.border = "1px solid gray";
        food.style.backgroundColor = "white";
        food.style.gridColumn = foodPos.column;
        food.style.gridRow = foodPos.row;
        food.style.borderRadius = "5px";
        gameBoard.appendChild(food);
    }
    const drawSnake = () => {
        for(let i=0; i<snake.length; i++){
            let p = document.createElement("p");
            p.className = "snake";
            p.style.height = "20px";
            p.style.width = "20px";
            p.style.border = "1px solid gray";
            p.style.gridColumn = snake[i].column;
            p.style.gridRow = snake[i].row;
            p.style.backgroundColor = "brown";
            p.style.borderRadius = "5px";
            gameBoard.appendChild(p);
        }
    }
    const draw = () => {
        gameBoard.innerHTML = "";
        drawSnake();
        drawFood();
    }
    const move = () => {
        const head = { ...snake[0] };
        switch (direction) {
            case "up":
                head.row--;
                break;
            case "down":
                head.row++
                break;
            case "left":
                head.column--;
                break;
            case "right":
                head.column++;
                break;
        }
        snake.unshift(head);
        if (foodPos.row === head.row && foodPos.column === head.column){
            updateScore();
            //regenerate food position
            foodPos = generateRandomPosition(); // not popping cause size increase
        }
        else
        snake.pop();//to illusion the motion
    }
    const updateScore = () => {
        currScore = snake.length  - 1; // -1 because snake's head was already there that cannot be counted as users score
        currentScoreDOM.innerText = currScore.toString().padStart(3, "0");
    }
    const resetGame = () => {
        audio.play();
        clearInterval(gameInterval);
        snake = [{row: 10, column: 10}]
        startState.classList.remove("displayNone");
        board.classList.add("displayNone");
        currentScoreDOM.innerText = (snake.length - 1).toString().padStart(3, "0");
        if(currScore > highScore)
            highScore = currScore;
        highestScoreDOM.innerText = highScore.toString().padStart(3, "0");
        window.localStorage.setItem("highScore", highScore);
        gameStarted = false;
    }
    const checkCollision = () => {
        const head = snake[0];
        //checking self collison
        for(let i=1; i<snake.length; i++){
            if(head.row == snake[i].row && head.column === snake[i].column)
                resetGame();
        }
        //check wall collision
        // gridSize equals will lead to collison but it has to be shown to user so
        // we donot reset the game at === gridSize but will let it render/draw
        // post that by default right moveemnt will increase heads row / colum by plus 1
        // so it wil cross gridSize and then we reset if we reset at == user will exit one box before walls
        // thts not what you want 
        if(head.column < 1 || head.column > gridSize || head.row < 1 || head.row > gridSize){
            resetGame();
        }
    }
    const clearInitialState = () => {
        startState.classList.add("displayNone");
        board.classList.remove("displayNone");
    }
    const startGame = () => {
        clearInitialState();
        gameStarted = true;
        foodPos = generateRandomPosition()
        gameBoard.innerHTML = "";
        gameInterval = setInterval(() => {
            move();
            checkCollision()
            draw();
        }, gameSpeedDelay)
    }
    const onKeyDown = (event) => {
        if (gameStarted==false && (event.code == "Space" || event.key == " "))
            startGame();
        else if (event.code == "ArrowUp" || event.key == "ArrowUp") {
            direction = "up";
        }
        else if (event.code == "ArrowDown" || event.code == "ArrowDown") {
            direction = "down";
        }
        else if (event.code == "ArrowLeft" || event.code == "ArrowLeft") {
            direction = "left";
        }
        else if (event.code == "ArrowRight" || event.code == "ArrowRight") {
            direction = "right";
        }
    }
    document.addEventListener("keydown", onKeyDown)
}
init();