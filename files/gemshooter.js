/* --------------------------------------------------------
Javascript file for Gem Shooter Game
last modified: 18.06.2018
author: Poonam Chand Sahu
website: https://pcsahu01.github.io
----------------------------------------------------------*/
        var dir;
        var score;
        var gameplay;
        var reqUpdate;
        var fireNow = false;
        var targetImg = 'target.png';
        var bombArray = ['bomb-1.png', 'bomb-2.png'];
        var gemArray = ['gem-1.png', 'gem-2.png', 'gem-3.png', 'gem-4.png', 'gem-5.png', 'gem-6.png'];
        var container = document.querySelector(".container");
        var gameover = document.querySelector(".gameOver");
        var target = document.querySelector(".target");
        var gem = document.querySelector(".gem");
        var btnStart = document.querySelector(".btnStart");
        var btnEnd = document.querySelector(".btnEnd");
        var thisContainer = {
            width: container.offsetWidth,
            height: container.offsetHeight,
            left: container.offsetLeft,
            top: container.offsetTop
        };
        
        init();
        //Function Definitions Begin Here
        
        function init()//Entry point for the game
        {

        if(location=="https://pcsahu01.github.io/gem-shooter-game.html")
        {
            dir = "https://rawgit.com/pcsahu01/Gem-Shooter-Javascript-Game/master/files/images/";
        }
        else
        {
            dir = 'files/images/';
        }
            btnStart.addEventListener('click', startGame);
            container.addEventListener('mousemove', moveTarget, true);
            container.addEventListener('mousedown', function() {
                fireNow = true;
            }, true);
            container.addEventListener('mouseup', function() {
                fireNow = false;
            }, true);
            btnEnd.addEventListener('click', endGame);
        }
        function moveTarget(e) {//Moves the target image with mouse pointer
            target.style.top = (e.clientY - 135) + 'px'; //e.clientX & 
            target.style.left = (e.clientX - 125) + 'px';//e.clientY are mouse pointer coordinates.
        }

        function ranImg(imgArray) { /* returns random image name out of all the images */
            var len = imgArray.length;
            var randomNum = Math.floor(Math.random() * len);
            return (imgArray[randomNum]);

        }

        function startGame(e) {/* Starts the game */
            if (!gameplay) {
                btnEnd.style.display    =   'inline-block';
                btnStart.style.display    =   'none';
                score = 0;
                gameplay = true;
                callObj(10,"gem");
                callObj(5,"bomb");
                gameover.style.display = 'none';
                reqUpdate = window.requestAnimationFrame(update);
            }
        }

        function endGame() {/*Ends the game and shows Game Over Screen */
            gameplay = false;
            gameover.style.display = 'block';
            gameover.innerHTML = 'Game Over <br> Score : ' + score;
            var objs = document.querySelectorAll('.gem,.bomb');
            for (var obj of objs) {
                obj.parentNode.removeChild(obj);
            }
            btnStart.style.display    =   'inline-block';
                btnEnd.style.display    =   'none';
        }

        function update() { /* Updates the game frame */
            if (!gameplay) {
                window.cancelAnimationFrame(reqUpdate);
            } else {
                reqUpdate = window.requestAnimationFrame(update)
            }
            var objs = document.querySelectorAll('.gem,.bomb');
            for (var obj of objs) {
                itemMover(obj);
            }
        }
        function updateScore(points) { /* Updates the score */
            score += parseInt(points);
            document.querySelector(".score").innerText = score;
        }

        function itemMover(e) {/* Moves the gems and bombs */
            if (fireNow && isCollision(target, e)) {
                if(e.className == "bomb")
                {//Ends the game if target collides with bomb .
                    endGame();
                }
                e.parentNode.removeChild(e);
                updateScore(e.dataset.points)
                objMaker(e.className);
            }
            var x = parseInt(e.style.left);
            var y = parseInt(e.style.top);
            var speed = parseInt(e.dataset.speed);
            if (e.dataset.mover <= 0) {
                e.dataset.speed = Math.ceil(Math.random() * 10) + 2;
                e.dataset.dir = Math.ceil(Math.random() * 8);
                e.dataset.mover = Math.ceil(Math.random() * 15) + 2;
            } else {
                e.dataset.mover--;
                if ((e.dataset.dir == '1' || e.dataset.dir == '2' || e.dataset.dir == '8') && x < thisContainer.width) {
                    x += speed;
                }
                if ((e.dataset.dir == '4' || e.dataset.dir == '5' || e.dataset.dir == '6') && x > 0) {
                    x -= speed;
                }
                if ((e.dataset.dir == '3' || e.dataset.dir == '2' || e.dataset.dir == '4') && y < thisContainer.width) {
                    y += speed;
                }
                if ((e.dataset.dir == '7' || e.dataset.dir == '6' || e.dataset.dir == '8') && y > 0) {
                    y -= speed;
                }

            }
            e.style.left = x + 'px';
            e.style.top = y + 'px';

        }

        function objMaker(objName) {/* Create new object of gem or bomb */
            var div = document.createElement("div");
            div.setAttribute('class', objName);
            if(objName=="bomb")
            {
                var objName = ranImg(bombArray);
            }
            else{
                
            var objName = ranImg(gemArray);

            }

            var randomNum = Math.floor(Math.random() * 50) + 50;
            var xCord = Math.floor(Math.random() * (thisContainer.width - randomNum));
            var yCord = Math.floor(Math.random() * (thisContainer.height - randomNum));
            var lineHeight = randomNum - (randomNum * 0.3) + 'px';
            div.style.left = xCord + 'px';
            div.style.top = yCord + 'px';
            div.style.height = randomNum + 'px';
            div.innerHTML = '<img src="' + dir + objName + '" class="img" height="' + randomNum + 'lineHeight="' + lineHeight + '">';
            div.dataset.points = Math.ceil(Math.random() * 10) + 2;
            div.dataset.speed = Math.ceil(Math.random() * 10) + 2;
            div.dataset.dir = Math.ceil(Math.random() * 8);
            div.dataset.mover = Math.ceil(Math.random() * 15) + 2;
            container.appendChild(div);
        }

        function callObj(num,objName) {/* Takes the number of object and type (gem ,bomb) and creates new object*/
            for (var x = 0; x < num; x++) {
                objMaker(objName);
            }
        }

        function isCollision(a, b) {/* Checks and returns if there is collision between target and gem/bomb */
            var aRect = a.getBoundingClientRect();
            var bRect = b.getBoundingClientRect();
            return !(
                ((aRect.top + aRect.height) < bRect.top) ||
                ((aRect.left + aRect.width) < bRect.left) ||
                ((bRect.top + bRect.height) < aRect.top) ||
                ((bRect.left + bRect.width) < aRect.left))
        }