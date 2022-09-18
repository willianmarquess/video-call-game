import CallComponent from "./pageComponents/call.component.js";
import LoginComponent from "./pageComponents/login.component.js";
import UserSevice from "./services/user.service.js";
import WebSocketManager from "./utils/web-socket-manager.util.js";
import VideoCallController from "./controller/video-call.controller.js";

async function bootstrap() {
    await WebSocketManager.connect();

    const userService = new UserSevice();
    const callComponent = new CallComponent({ 
        parentElem: document.getElementById('game-camera')
    });
    const videoCallController = new VideoCallController();

    const loginComponent = new LoginComponent({ 
        parentElem: document.getElementById('game'),
        userService,
        callComponent,
        videoCallController 
    });

    loginComponent.render();
}


bootstrap();