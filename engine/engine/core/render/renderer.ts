namespace vincy {
  export class Renderer {
    public static canvas;
    public static device: any;
    public static scene;

    public static initWebGL(canvas, opts) {
      this.canvas = canvas;
    }
  }
}
