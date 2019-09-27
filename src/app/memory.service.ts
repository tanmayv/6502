import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MemoryService {

  private memory: number[];
  private changeSubject: BehaviorSubject<{}> = new BehaviorSubject(null);

  public readonly change: Observable<{}> = this.changeSubject.asObservable();

  public initialize(size: number, defaultValue: number) {
    this.memory = Array.from({ length: size }, (v, i) => defaultValue);
    this.changeSubject.next(-1);
  }

  public writeByte(address, value) {
    console.log('write', Number(address).toString(16), Number(value).toString(16));
    this.memory[ address ] = value;
    this.changeSubject.next({ address, value });
  }

  public readByteRange(addressStart, addressEnd) {
    return this.memory.slice(addressStart, addressEnd);
  }

  public readByte(address) {
    return this.memory[address];
  }

}
