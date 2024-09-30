import React, { useEffect } from "react";
import ZoomMtgEmbedded from "@zoomus/websdk/embedded";

const Index = () => {
  const ZoomMeet = async () => {
    if (window.ZoomCredentials) {
      const meetigNumber = window.ZoomCredentials.meetigNumber;
      const password = window.ZoomCredentials.password;
      const { ZoomMtg } = await import("@zoomus/websdk");
      const client = ZoomMtgEmbedded.createClient();
      let meetingSDKElement = document.getElementById("meetingSDKElement");
      const signature = ZoomMtg.generateSDKSignature({
        meetingNumber: meetigNumber,
        role: window.ZoomCredentials.role,
        sdkKey: window.ZoomCredentials.sdkKey,
        sdkSecret: window.ZoomCredentials.sdkSecret,
      });
      client.init({
        zoomAppRoot: meetingSDKElement,
        language: "en-US",
      });

      client
        .join({
          sdkKey: window.ZoomCredentials.sdkKey,
          signature: signature,
          meetingNumber: meetigNumber,
          userName: window.ZoomCredentials.name,
          password: password,
          userEmail: window.ZoomCredentials.email,
        })
        .then((e) => {
          console.log("join success", e.reason);
        })
        .catch((e) => {
          console.log("join error", e);
        });
      console.clear();
    }
  };

  useEffect(() => {
    ZoomMeet();
  }, []);

  return <div id="meetingSDKElement" />;
};

export default Index;
