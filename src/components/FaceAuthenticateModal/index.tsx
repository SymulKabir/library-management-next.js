import React, { useState, useRef, useEffect } from "react";
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";
import { getRandomId } from "@/src/utils/random";
import { IoReload } from "react-icons/io5";
import { WEB_RTC_CONFIG, QR_CODE_VALID_TIME } from "@/src/constants/faceAuth";
import { BACKEND_URL, ML_BACKEND_URL } from "@/src/constants";
import { removeAdminToken, setStudentToken } from "@/src/utils/cookies";
import { setStudent } from "@/src/store/student/reducer";
import { removeAdmin } from "@/src/store/admin/reducer";
import { successToast, warningToast } from "@/src/utils/toast";
import { TbReload } from "react-icons/tb";

const Index = ({ showModal, closeModal, studentID }: any) => {
  if (!showModal) return null;
  const [faceWarning, setFaceWarning] = useState(false);
  const [generatedSessionID, setGeneratedSessionID] = useState(getRandomId(12));
  const [faceAuthProgress, setFaceAuthProgress] = useState(0);
  const [streamingStatus, setStreamingStatus] = useState<any>({
    demo: false,
    preview: false,
    scanning: false,
    loading: false,
    retry: false,
    showQrCode: false,
    detectVPN: false,
  });

  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dataChannelRef = useRef<RTCDataChannel | null>(null);
  const callSingUpAPIRef = useRef<boolean>(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const sessionID = searchParams.get("session");

  useEffect(() => {
    const handleBeforeUnload = async () => {
      const res = await fetch(
        `${ML_BACKEND_URL}/api/face-auth/remove-session`,
        {
          method: "POST",
          body: JSON.stringify({
            session: generatedSessionID,
          }),
        },
      );
      await res.json();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [generatedSessionID]);

  useEffect(() => {
    (async () => {
      if (sessionID) {
        const res = await fetch(
          `${ML_BACKEND_URL}/face-auth/session-verify?session=${sessionID}`,
        );
        const { status } = await res.json();
        if (status !== "verified") {
          if (showModal) {
            showModal(false);
            stopWebRTC();
          }
          router.push("/");
        }
      }
    })();
  }, [sessionID]);

  useEffect(() => {
    const init = async () => {
      const hasCamera = await checkCameraAccess();
      if (hasCamera) {
        setStreamingStatus((prev: any) => ({ ...prev, demo: true }));

        setTimeout(() => {
          setStreamingStatus((prev: any) => ({
            ...prev,
            demo: false,
            preview: true,
            loading: true,
          }));
          startVideoStreaming();
        }, 2000);
      } else {
        if (sessionID) {
          router.push("/");
        } else {
          setStreamingStatus((prev: any) => ({ ...prev, showQrCode: true }));
          await startQrCodeStriming();
        }
      }
    };
    init();
    return () => stopWebRTC();
  }, []);

  const checkCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((t) => t.stop());
      return true;
    } catch {
      return false;
    }
  };
  const checkRTCResponse = (event: any) => {
    if (event.data) {
      const response = JSON.parse(event.data);
      console.log("response ---->>>>", response)
      setFaceWarning(response.warning || false);
      if (response.verified_percentage) {
        setFaceAuthProgress(response.verified_percentage);
      }
      if (sessionID) {
        if (response.status === "timeout") {
          setStreamingStatus({
            preview: true,
            scanning: false,
            retry: true,
            loading: false,
          });
          stopWebRTC();
        } else if (response.status === "unauthorized") {
          setStreamingStatus({
            preview: false,
            scanning: false,
            retry: false,
            loading: false,
            showQrCode: false,
            retryShowQrCode: false,
          });
          router.push("/");
          stopWebRTC();
        } else if (response.status === "recognized" && response.face_id) {
          setStreamingStatus({
            preview: false,
            scanning: false,
            retry: false,
            loading: false,
            showQrCode: false,
          });
          router.push("/");
          stopWebRTC();
        }
      } else {
        if (response.status === "timeout") {
          setStreamingStatus({
            preview: true,
            scanning: false,
            showQrCode: false,
            retry: true,
            retryShowQrCode: false,
            loading: false,
          });
          stopWebRTC();
        } else if (response.status === "session expired") {
          setStreamingStatus({
            preview: false,
            scanning: false,
            retry: false,
            loading: false,
            showQrCode: true,
            retryShowQrCode: true,
          });
          stopWebRTC();
        } else if (response.status === "unauthorized") {
          setStreamingStatus({
            preview: false,
            scanning: false,
            retry: false,
            loading: false,
            showQrCode: false,
            retryShowQrCode: false,
          });
          router.push("/");
          stopWebRTC();
        } else if (response.status === "session completed") {
          setStreamingStatus({
            preview: false,
            scanning: false,
            retry: false,
            loading: false,
            showQrCode: false,
            retryShowQrCode: false,
          });
          router.push("/");
          stopWebRTC();
        } else if (response.status === "recognized" && response.face_id) {
          setStreamingStatus({
            preview: true,
            scanning: false,
            retry: false,
            loading: false,
          });
          stopWebRTC();
          signup(response.face_id);
        }
      }
    }
  };

  const startVideoStreaming = async () => {
    if (pcRef?.current) stopWebRTC();

    const stream = await navigator.mediaDevices.getUserMedia({
      // video: { facingMode: "user", width: 480, height: 640 },
      video: {
        facingMode: "user",
        width: { ideal: 240 },
        height: { ideal: 320 },
        frameRate: { ideal: 8, max: 10 },
      },
    });

    // pcRef.current = new RTCPeerConnection();
    pcRef.current = new RTCPeerConnection(WEB_RTC_CONFIG);

    pcRef.current.ontrack = (event: any) => {
      if (remoteVideoRef.current) {
        // remoteVideoRef.current.srcObject = event.streams[0];
        setStreamingStatus((prev: any) => ({
          ...prev,
          loading: false,
        }));
        remoteVideoRef.current.srcObject = stream;
      }
    };

    // Create channel BEFORE offer
    dataChannelRef.current =
      pcRef?.current?.createDataChannel("face-auth-channel");

    dataChannelRef.current.onmessage = (event) => {
      checkRTCResponse(event);
    };

    try {
      stream
        .getTracks()
        .forEach((track) => pcRef?.current?.addTrack(track, stream));

      const sender = pcRef?.current
        .getSenders()
        .find((s) => s.track?.kind === "video");

      if (sender) {
        const params = sender.getParameters();

        if (!params.encodings) {
          params.encodings = [{}];
        }

        params.encodings[0] = {
          maxBitrate: 150000, // 150 kbps (good for face auth)
          maxFramerate: 10,
        };

        sender.setParameters(params);
      }

      const offer = await pcRef?.current?.createOffer();
      await pcRef?.current?.setLocalDescription(offer);

      // --- CRITICAL FIX: WAIT FOR ICE GATHERING ---
      if (pcRef?.current?.iceGatheringState !== "complete") {
        await new Promise((resolve: any) => {
          const onIceComplete = () => {
            if (pcRef?.current?.iceGatheringState === "complete") {
              pcRef?.current?.removeEventListener(
                "icegatheringstatechange",
                onIceComplete,
              );
              resolve();
            }
          };
          pcRef?.current?.addEventListener(
            "icegatheringstatechange",
            onIceComplete,
          );
          setTimeout(resolve, 5000);
        });
      }

      const res = await fetch(`${ML_BACKEND_URL}/face-auth/video-stream`, {
        method: "POST",
        body: JSON.stringify({
          sdp: pcRef?.current?.localDescription?.sdp,
          type: pcRef?.current?.localDescription?.type,
          sessionID,
          sessionTime: QR_CODE_VALID_TIME,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const answer = await res.json();
      await pcRef?.current?.setRemoteDescription(
        new RTCSessionDescription(answer),
      );
      setStreamingStatus((prev: any) => ({
        ...prev,
        scanning: true,
        loading: false,
      }));
    } catch (err) {
      console.error("WebRTC Error:", err);
    }
  };

  const stopWebRTC = () => {
    if (remoteVideoRef.current?.srcObject) {
      const stream = remoteVideoRef.current.srcObject as MediaStream;

      stream?.getTracks().forEach((track) => {
        track.stop();
      });

      remoteVideoRef.current.srcObject = null;
    }

    if (pcRef?.current) {
      pcRef?.current?.close();
      pcRef.current = null;
    }
  };

  const signup = async (faceID: string) => {
    try {
      if (callSingUpAPIRef.current) {
        return;
      }
      callSingUpAPIRef.current = true;
      stopWebRTC();

      if (studentID) {
        const res = await fetch(`${BACKEND_URL}/api/students/set-face-id`, {
          method: "POST",
          body: JSON.stringify({ faceID, studentID }),
        });
        const { data, message } = await res.json();
        closeModal();
        if (data) {
          dispatch(setStudent(data));
          dispatch(removeAdmin());
          successToast("Set face id successful!");
        } else {
          warningToast(message || "Failed to set face id!");
        }
      } else {
        const res = await fetch(
          `${BACKEND_URL}/api/students/signin-with-face`,
          {
            method: "POST",
            body: JSON.stringify({ faceID }),
          },
        );
        const { data, token, message } = await res.json();

        if (data) {
          if (token) {
            setStudentToken(token);
            removeAdminToken();
          }
          dispatch(setStudent(data));
          dispatch(removeAdmin());
          successToast("Authentication successful!");
          router.push(`/`);
          closeModal();
        } else {
          warningToast(
            "Face not registered. Please complete your registration.",
          );
          router.push(`/signup?faceId=${faceID}`);
        }
      }
    } catch (error: any) {
    } finally {
      callSingUpAPIRef.current = false;
    }
  };
  const handleReverification = () => {
    startVideoStreaming();
    setStreamingStatus((prev: any) => {
      return {
        ...prev,
        retry: false,
        detectVPN: false,
        loading: true,
      };
    });
  };
  const startQrCodeStriming = async () => {
    if (pcRef?.current) stopWebRTC();

    try {
      pcRef.current = new RTCPeerConnection(WEB_RTC_CONFIG);

      dataChannelRef.current = pcRef?.current?.createDataChannel(
        "check-another-device-striming",
      );

      dataChannelRef.current.onmessage = (event) => {
        checkRTCResponse(event);
      };
      const offer = pcRef?.current?.createOffer() as any;
      pcRef.current.setLocalDescription(offer);
      // --- CRITICAL FIX: WAIT FOR ICE GATHERING ---
      if (pcRef.current.iceGatheringState !== "complete") {
        await new Promise((resolve: any) => {
          const onIceComplete = () => {
            if (pcRef?.current?.iceGatheringState === "complete") {
              pcRef?.current?.removeEventListener(
                "icegatheringstatechange",
                onIceComplete,
              );
              resolve();
            }
          };
          pcRef?.current?.addEventListener(
            "icegatheringstatechange",
            onIceComplete,
          );
          setTimeout(resolve, 5000);
        });
      }
      const res = await fetch(`${ML_BACKEND_URL}/face-auth/qr-code-session`, {
        method: "POST",
        body: JSON.stringify({
          sdp: pcRef?.current?.localDescription?.sdp,
          type: pcRef?.current?.localDescription?.type,
          sessionID: generatedSessionID,
          sessionTime: QR_CODE_VALID_TIME,
        }),
        headers: { "Content-Type": "application/json" },
      });
      const answer = await res.json();
      await pcRef?.current?.setRemoteDescription(
        new RTCSessionDescription(answer),
      );
    } catch (error: any) {}
  };
  const reloadQRCode = () => {
    setGeneratedSessionID(getRandomId(12));
    startQrCodeStriming();
    setStreamingStatus({
      preview: false,
      scanning: false,
      retry: false,
      loading: false,
      showQrCode: true,
      retryShowQrCode: false,
    });
  };

  const handleCancelAuthButton = () => {
    stopWebRTC();
    closeModal();
  };

  return (
    <div className="face-authenticate-modal">
      <div className="inner-authenticate">
        <div className="header-section">
          <img src="/logo.png" alt="BookHive" />
          <h2>
            {streamingStatus.showQrCode
              ? "Camera Unavailable"
              : "Authenticating Face"}
          </h2>
          <p>
            {streamingStatus.showQrCode
              ? "No camera detected. Please scan the QR code with your mobile device to continue."
              : "Please ensure your face is clearly visible within the circle for a secure liveness check."}
          </p>
        </div>
        {(streamingStatus.preview || streamingStatus.demo) && (
          <div className="video-streaming-section">
            <div
              className={`video-streaming-inner-container ${faceWarning ? "warning" : ""} ${streamingStatus.retry ? "retry" : ""} ${streamingStatus.showQrCode ? "square" : ""}`}
            >
              {(streamingStatus.demo || streamingStatus.loading) && (
                <div>
                  <div className="auth-demo">
                    <video
                      src="/assets/face-auth-demo.mp4"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  </div>
                </div>
              )}
              {streamingStatus.preview && (
                <div className="video-section">
                  <video ref={remoteVideoRef} autoPlay playsInline />
                  <div
                    className={`face-frame ${streamingStatus.scanning ? "scanning" : ""}`}
                  >
                    {streamingStatus.retry && (
                      <button
                        onClick={handleReverification}
                        className="retry-btn"
                      >
                        <TbReload />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {streamingStatus.showQrCode && (
          <div className="qr-code-section">
            <div className="main-qr-code-section">
              <div
                className={`qr-code ${streamingStatus.retryShowQrCode ? "reload" : ""}`}
              >
                <QRCodeCanvas
                  value={`${BACKEND_URL}?session=${generatedSessionID}`}
                  size={220}
                  bgColor="#ffffff"
                  level="H"
                />
                <p>{`${BACKEND_URL}?session=${generatedSessionID}`}</p>
                <span className="blur-cover" />
                <button className="reload-btn" onClick={reloadQRCode}>
                  <IoReload />
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="footer-section">
          {!streamingStatus.showQrCode && (
            <div
              className="progress-bar"
              style={
                {
                  "--progress": `${faceAuthProgress}%`,
                } as React.CSSProperties
              }
            ></div>
          )}

          <button className="cancel-btn" onClick={handleCancelAuthButton}>
            Cancel Authentication
          </button>
        </div>
      </div>
    </div>
  );
};

export default Index;
