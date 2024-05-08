import { Component, HostListener, Input } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @Input() volume: number = 50; // Default volume
  angle: number = 0;
  showIndicator: boolean = false;


  ngOnInit() {
    this.calculateAngle();
  }

  ngOnChanges() {
    this.calculateAngle();
      //  this.checkVolumeIncrease();
  }

  calculateAngle() {
    // Calculate the angle of rotation based on the volume value
    this.angle = (this.volume / 100) * 270 - 135;
  }

  onMouseDown(event: MouseEvent) {
    const startX = event.clientX;
    const startY = event.clientY;

    const knob = event.currentTarget as HTMLElement;
    const rect = knob.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const startAngle = Math.atan2(startY - centerY, startX - centerX);

    const onMouseMove = (moveEvent: MouseEvent) => {
      const currentX = moveEvent.clientX;
      const currentY = moveEvent.clientY;
      const currentAngle = Math.atan2(currentY - centerY, currentX - centerX);
      const newAngle = currentAngle - startAngle + this.angle;

      // Normalize the angle to be between -135 and 135 degrees
      this.angle = Math.max(Math.min(newAngle, 135), -135);

      // Convert angle to volume
      this.volume = ((this.angle + 135) / 270) * 100;
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }





  // onMouseDown(event: MouseEvent) {
  //   const startX = event.clientX;
  //   const startY = event.clientY;

  //   const knob = event.currentTarget as HTMLElement;
  //   const rect = knob.getBoundingClientRect();
  //   const centerX = rect.left + rect.width / 2;
  //   const centerY = rect.top + rect.height / 2;
  //   const knobRadius = rect.width / 2;

  //   const startAngle = Math.atan2(startY - centerY, startX - centerX);

  //   const onMouseMove = (moveEvent: MouseEvent) => {
  //     const currentX = moveEvent.clientX;
  //     const currentY = moveEvent.clientY;
  //     const currentAngle = Math.atan2(currentY - centerY, currentX - centerX);
  //     const distance = Math.sqrt((currentX - centerX) ** 2 + (currentY - centerY) ** 2);

  //     // Check if the mouse movement is within the knob radius
  //     if (distance <= knobRadius) {
  //       const newAngle = currentAngle - startAngle + this.angle;

  //       // Normalize the angle to be between -135 and 135 degrees
  //       this.angle = Math.max(Math.min(newAngle, 135), -135);

  //       // Convert angle to volume
  //       this.volume = ((this.angle + 135) / 270) * 100;
  //     }
  //   };

  //   const onMouseUp = () => {
  //     window.removeEventListener('mousemove', onMouseMove);
  //     window.removeEventListener('mouseup', onMouseUp);
  //   };

  //   window.addEventListener('mousemove', onMouseMove);
  //   window.addEventListener('mouseup', onMouseUp);
  // }


  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent) {
    event.preventDefault(); // Prevent default scrolling behavior

    const delta = Math.sign(event.deltaY); // Get scroll direction (+1 for up, -1 for down)

    // Adjust volume based on scroll direction
    this.volume += delta * 5; // You can adjust the step size here

    // Ensure volume stays within range [0, 100]
    this.volume = Math.max(0, Math.min(this.volume, 100));

    // Update knob angle
    this.calculateAngle();
  }

  // checkVolumeIncrease() {
  //   // Check if volume increased and show indicator
  //   if (this.volume > 0) {
  //     this.showIndicator = true;
  //     setTimeout(() => {
  //       this.showIndicator = false;
  //     }, 1000); // Hide indicator after 1 second
  //   }
  // }

  onClick(event: MouseEvent) {
    const knob = event.currentTarget as HTMLElement;
    const rect = knob.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const clickX = event.clientX;
    const clickY = event.clientY;

    // Calculate distance from center of knob
    const distance = Math.sqrt((clickX - centerX) ** 2 + (clickY - centerY) ** 2);

    // If click is within knob radius, update volume
    if (distance <= rect.width / 2) {
      this.updateVolume(clickX, clickY, centerX, centerY, rect.width / 2);
    }
  }

  updateVolume(clickX: number, clickY: number, centerX: number, centerY: number, knobRadius: number) {
    // Calculate angle based on click position
    const angle = Math.atan2(clickY - centerY, clickX - centerX);
    // Convert angle to volume
    const volume = ((angle + Math.PI) / (Math.PI * 2)) * 100;
    // Update volume
    this.volume = Math.round(volume);
    // Update angle
    this.calculateAngle();
  }
}
