namespace vincy {
  export interface Config {
    debugMode: number;
    frameRate: number;
    renderMode: number;
    showFPS: boolean;
    registerSysEvent: boolean;
    scenes: any[];
    collisionMatrix: any[];
    groupList: any[];
    jsList: string[];
  }
  export class game {
    public static Config: Config = {
      debugMode: 0,
      frameRate: 60,
      renderMode: 0,
      showFPS: true,
      registerSysEvent: false,
      scenes: [],
      collisionMatrix: [],
      groupList: [],
      jsList: []
    };
    private static pasue: boolean = false;
    private static prepared: boolean = false;
    private static lastTime: number = 0;
    private static frameTime: number = 0;
    private static rendererInitialized: boolean = false;
    private static onStart: Function;

    private static canvas: any;

    private static intervalID: number;

    private static initConfig(config: Config) {}

    private static prepare() {
      if (this.prepared) {
        if (this.onStart) this.onStart();
        return;
      }

      this.prepareDone();
    }

    private static initRenderer() {
      if (this.rendererInitialized) return;

      this.canvas = document.createElement("CANVAS");
      let opt = {};
      Renderer.initWebGL(this.canvas, opt);
      this.rendererInitialized = true;
    }

    private static initEvent() {}

    private static initEngine() {
      if (this.rendererInitialized) return;
      this.initRenderer();

      if (!VI_EDITOR) this.initEvent();
    }

    public static setFrameRate(frameRate: number) {
      this.Config.frameRate = frameRate;
      if (this.intervalID) window.cancelAnimationFrame(this.intervalID);
      this.intervalID = 0;
      this.pasue = true;
      this.initFrameCall();
      this.runMainLoop();
    }

    private static initFrameCall() {
      this.lastTime = Date.now();
      let frameRate = this.Config.frameRate;
      this.frameTime = 1000 / frameRate;
      if (frameRate != 30 && frameRate != 60) {
        window.requestAnimationFrame = this.startTimeout;
        window.cancelAnimationFrame = this.cancelTimeout;
      } else {
        window.requestAnimationFrame =
          window.requestAnimationFrame ||
          window.webkitRequestAnimationFrame ||
          window["mozRequestAnimationFrame"] ||
          window["oRequestAnimationFrame"] ||
          window["msRequestAnimationFrame"] ||
          this.startTimeout;

        window.cancelAnimationFrame =
          window.cancelAnimationFrame ||
          window["cancelRequestAnimationFrame"] ||
          window["msCancelRequestAnimationFrame"] ||
          window["mozCancelRequestAnimationFrame"] ||
          window["oCancelRequestAnimationFrame"] ||
          window["webkitCancelRequestAnimationFrame"] ||
          window["msCancelAnimationFrame"] ||
          window["mozCancelAnimationFrame"] ||
          window.webkitCancelAnimationFrame ||
          window["oCancelAnimationFrame"] ||
          this.cancelTimeout;
      }
    }

    private static prepareDone() {
      this.prepared = true;

      this.initEngine();

      console.log(
        "美丽大方的吃吃专用引擎 Vincy Engine v" + vincy.ENGINE_VERSION
      );

      this.initFrameCall();
      this.runMainLoop();
      if (this.onStart) this.onStart();
    }

    public static emit(event: string) {}

    public static step() {
      vincy.director.mainLoop();
    }

    public static run(config?: Config, onStart?: Function) {
      onStart && (this.onStart = onStart);
      config && this.initConfig(config);
      this.prepare();
    }

    private static startTimeout(callback: Function): number {
      let curTime = Date.now();
      let timeToCall = Math.max(0, this.frameTime - (curTime - this.lastTime));
      let id = window.setTimeout(function() {
        callback();
      }, timeToCall);
      this.lastTime = curTime + timeToCall;
      return id;
    }

    private static cancelTimeout(id) {
      window.clearTimeout(id);
    }

    public static pause() {}

    public static resume() {}

    public static restart() {}

    public static end() {}

    private static runMainLoop() {
      let self = this,
        callback,
        config = this.Config,
        director = vincy.director,
        skip = true,
        frameRate = config.frameRate;

      callback = function() {
        if (!self.pasue) {
          self.intervalID = window.requestAnimationFrame(callback);
          if (frameRate == 30) {
            if ((skip = !skip)) return;
          }

          director.mainLoop();
        }
      };

      self.intervalID = window.requestAnimationFrame(callback);
      self.pasue = false;
    }
  }
}
