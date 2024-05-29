import * as THREE from '../node_modules/three/build/three.module.js';
import Stats from '../node_modules/three/examples/jsm/libs/stats.module.js';

/** Dequeue and resample time series values with linear interpolation */
export default class TimeResampler {

    /** Construct a new TimeResampler with numSamples in the circular buffer */
    constructor(numSamples) {
        this.numSamples = numSamples;
        this.values = new Array(this.numSamples).fill(0);
        this.times  = new Array(this.numSamples).fill(10000);
        this.head   = 0;
        this.tail   = 1;
    }

    /** Enqueue a new value */
    enqueue(timeMS, value){
        this.values[this.tail] = value;
        this.times[this.tail] = timeMS;
        this.tail = (this.tail + 1) % this.numSamples;
    }

    /** Resample the time series - BROKEN */
    interpolate(timeMS){
        let nextIdx = (this.head + 1)  % this.numSamples;
        while(true){
            if((this.times[this.head] > timeMS && this.times[nextIdx] < timeMS) || nextIdx == this.tail){
                break;
            } else {
                this.head = nextIdx;
                nextIdx = (this.head + 1)  % this.numSamples;
            }
        }
        if(timeMS > this.times[nextIdx] + 16.0){ return this.values[nextIdx]; }

        let alpha = (timeMS - this.times[this.head]) / (this.times[nextIdx] - this.times[this.head]);
        return this.values[this.head] + alpha * (this.values[nextIdx] - this.values[this.head]);
    }

}