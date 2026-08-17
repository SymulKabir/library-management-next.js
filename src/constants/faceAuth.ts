export const WEB_RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    {
      urls: [
        "turn:103.251.247.198:3478?transport=udp",
        "turn:103.251.247.198:3478?transport=tcp",
      ],
      username: "webrtc",
      credential: "yourpassword123",
    },
  ],
  iceTransportPolicy: "all",
};

export const QR_CODE_VALID_TIME = 2 * 60; // 2 minutes
