import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import { Maze, Cell, KeyboardMap } from './models';
declare const $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'gaming';
  row = 15;
  col = 15;
  cellSize = 20; // cell size
  playOn = false

  setTime: any = 30

  private maze: Maze | any;
  private canvas: HTMLCanvasElement | any;
  private ctx: CanvasRenderingContext2D | any;
  private gameOver = false;
  private myPath: Cell[] = [];
  private currentCell: Cell | any;
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }

  ngAfterViewInit(): void {

  }

  openPlayGround() {
    const div = document.getElementById('playbox');
    if (this.playOn) {
      setTimeout(() => {
        this.countDown();
        $('#exampleModal').modal('hide');
        var canvas = document.createElement('canvas');
        canvas.id = 'maze'
        canvas.width = 640;
        canvas.height = 480
        canvas.className = 'img-fluid'
        div?.appendChild(canvas)
        this.canvas = document.getElementById('maze');
        this.ctx = this.canvas.getContext('2d');
        this.drawMaze();
      }, 10);
    } else {
      this.canvas = document.getElementById('maze');
      div?.removeChild(this.canvas)
    }
  }

  drawMaze() {
    this.maze = new Maze(this.row, this.col, this.cellSize, this.ctx);
    this.canvas.width = this.col * this.cellSize;
    this.canvas.height = this.row * this.cellSize;
    this.maze.draw();
    this.initPlay();
  }

  initPlay(lineThickness = 10, color = '#4080ff') {
    this.gameOver = false;
    this.myPath.length = 0;
    this.ctx.lineWidth = lineThickness;
    this.ctx.strokeStyle = color;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.cellSize / 2);
    this.ctx.lineTo(this.cellSize / 2, this.cellSize / 2);
    this.ctx.stroke();
    this.currentCell = this.maze.cells[0][0];
    this.myPath.push(this.currentCell);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (this.gameOver) return;
    const direction = KeyboardMap[event.key];
    if (direction) this.move(direction);
  }

  move(direction: 'Left' | 'Right' | 'Up' | 'Down') {
    let nextCell: Cell | any;
    if (direction === 'Left') {
      if (this.currentCell.col < 1) return;
      nextCell = this.maze.cells[this.currentCell.row][
        this.currentCell.col - 1
      ];
    }
    if (direction === 'Right') {
      if (this.currentCell.col + 1 >= this.col) return;
      nextCell = this.maze.cells[this.currentCell.row][
        this.currentCell.col + 1
      ];
    }
    if (direction === 'Up') {
      if (this.currentCell.row < 1) return;
      nextCell = this.maze.cells[this.currentCell.row - 1][
        this.currentCell.col
      ];
    }
    if (direction === 'Down') {
      if (this.currentCell.row + 1 >= this.row) return;
      nextCell = this.maze.cells[this.currentCell.row + 1][
        this.currentCell.col
      ];
    }
    if (this.currentCell.hasConnectionWith(nextCell)) {
      if (
        this.myPath.length > 1 &&
        this.myPath[this.myPath.length - 2].equals(nextCell)
      ) {
        this.maze.erasePath(this.myPath);
        this.myPath.pop();
      } else {
        this.myPath.push(nextCell);
        if (nextCell.equals(new Cell(this.row - 1, this.col - 1))) {
          this.hooray();
          this.gameOver = true;
          this.maze.drawSolution('#4080ff');
          return;
        }
      }

      this.maze.drawPath(this.myPath);
      this.currentCell = nextCell;
    }
  }

  solution() {
    this.gameOver = true;
    this.maze.drawSolution('#ff7575', 3);
  }

  countDown() {
    const time_out = setInterval(() => {
      if (this.setTime == 0) {
        $('#timer').html('Time Over');
        alert('Timer over, Please vist our side')
      } else {
        if (this.setTime < 10) {
          this.setTime = 0 + '' + this.setTime;
        }
        $('#timer').html('00:' + this.setTime);
        this.setTime -= 1;
      }
    }, 1000);
  }

  private hooray() {
    alert('You win the match')
  }
}
