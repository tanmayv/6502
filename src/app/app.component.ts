import { Component, OnInit } from '@angular/core';
import { MemoryService } from './memory.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'emulator';
  private WIDTH = 40;
  private HEIGHT = 40;
  private SCREEN_AREA = this.WIDTH * this.HEIGHT;       // bytes
  private CODE_AREA = 800;                              // bytes
  private START_MEM = 0x320;                            // 800
  private END_MEM = this.START_MEM + this.SCREEN_AREA;  // 2400
  screenMemory: number[] = [];
  displayMatrix: any[];
  Number = Number;
  command = '';
  constructor(private memory: MemoryService) {}

  ngOnInit(): void {
    this.memory.initialize(this.SCREEN_AREA + this.CODE_AREA, 0x00);

    this.memory.change.subscribe((data) => {
      this.update(data);
    });
    this.memory.writeByte(this.START_MEM, 0x54);
    this.memory.writeByte(this.START_MEM + 1, 0xFF);
  }

  private update(data) {
    if (data && data.address) {
      if (data.address >= this.START_MEM && data.address < this.END_MEM) {
        if (!this.displayMatrix) {
          this.screenMemory = this.memory.readByteRange(this.START_MEM, this.END_MEM);

          this.displayMatrix = Array.from({ length: this.HEIGHT }, (v, row) => {
            return Array.from({ length: this.WIDTH }, (v1, col) => this.screenMemory[this.WIDTH * row + col]);
          });
        } else {
          const row = Math.floor((data.address - this.START_MEM) / this.WIDTH);
          const col = Math.floor((data.address - this.START_MEM) % this.WIDTH);
          this.displayMatrix[row][col] = data.value;
        }
        console.log(this.displayMatrix);
      }
    }
  }

  submit() {
    const input = this.command.split(' ');

    if (input.length === 2) {
      const address = parseInt(input[0], 16);
      const value = input[1];
      this.memory.writeByte(address, value);
    } else if (input.length === 3) {
      const address = parseInt(input[0], 16) << 8 | parseInt(input[1], 16);
      const value = input[2];
      this.memory.writeByte(address, value);
    }

    this.command = '';
  }
}
