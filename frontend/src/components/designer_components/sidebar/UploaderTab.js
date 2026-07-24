import { useEffect, useRef, useState } from "react";
import {
  getNewSizePos,
  addDesignCollageToActiveView,
} from "../../../utils/designerUtils";
import data from "../../../utils/googleDrive/googleDriveKeys.json";

export default function UploaderTab({
  setActiveTab,
  imgRef,
  updateDesignsByView,
  setSelectedDesignId,
  getBoundingBox,
  activePreview,
  regionWidth,
  regionHeight,
  isMobile = false,
}) {
  const APP_ID = data.APP_ID;
  const CLIENT_ID = data.CLIENT_ID;
  const API_Key = data.API_Key;
  const inputRef = useRef(null);

  const [isDragging, setIsDragging] = useState(false);

  const [pickerReady, setPickerReady] = useState(false);
  const accessTokenRef = useRef(null);

  useEffect(() => {
    const loadScript = (src) =>
      new Promise((resolve, reject) => {
        const script = document.createElement("script");

        script.src = src;
        script.async = true;

        script.onload = resolve;
        script.onerror = reject;

        document.body.appendChild(script);
      });

    Promise.all([
      loadScript("https://accounts.google.com/gsi/client"),
      loadScript("https://apis.google.com/js/api.js"),
    ]).then(() => {
      window.gapi.load("picker", () => {
        setPickerReady(true);
      });
    });
  }, []);

  const addImageFromUrl = (imageUrl) => {
    const img = new Image();

    img.crossOrigin = "anonymous";

    img.onload = () => {
      const aspectRatio = img.width / img.height;

      const baseWidth = 0.2;

      const baseHeight = baseWidth / aspectRatio;

      addDesignCollageToActiveView(
        {
          designs: [
            getNewSizePos(
              getBoundingBox,
              {
                src: imageUrl,
                x: 0.25,
                y: 0.25,
                width: baseWidth,
                height: baseHeight,
                type: "upload",
              },
              activePreview,
              regionWidth,
              regionHeight,
              0,
            ),
          ],
        },
        imgRef,
        setSelectedDesignId,
        updateDesignsByView,
        activePreview,
      );

      // setSelectedDesignId(id);
      setActiveTab("editUpload");
    };

    img.src = imageUrl;
  };

  const fetchDriveImage = async (fileId, accessToken) => {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const blob = await response.blob();

    return URL.createObjectURL(blob);
  };

  const pickerCallback = async (data) => {
    if (data.action !== window.google.picker.Action.PICKED) {
      return;
    }

    const file = data.docs[0];

    const url = await fetchDriveImage(file.id, accessTokenRef.current);

    addImageFromUrl(url);
  };

  const createPicker = (accessToken) => {
    const view = new window.google.picker.DocsView()
      .setIncludeFolders(false)
      .setMimeTypes("image/png,image/jpeg,image/webp,image/gif");

    const picker = new window.google.picker.PickerBuilder()
      .addView(view)
      .setOAuthToken(accessToken)
      .setDeveloperKey(API_Key)
      .setAppId(APP_ID)
      .setCallback(pickerCallback)
      .build();

    picker.setVisible(true);
  };

  const openGoogleDrive = () => {
    if (!pickerReady) {
      return;
    }

    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,

      scope: "https://www.googleapis.com/auth/drive.readonly",

      callback: (response) => {
        accessTokenRef.current = response.access_token;

        createPicker(response.access_token);
      },
    });

    tokenClient.requestAccessToken();
  };

  const handleFiles = (files) => {
    const images = [...files].filter((file) => file.type.startsWith("image/"));

    if (images.length) {
      const file = images[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const img = new Image();
          img.onload = () => {
            const aspectRatio = img.width / img.height;

            // pick a base normalized width
            const baseWidth = 0.2;
            const baseHeight = baseWidth / aspectRatio;

            addDesignCollageToActiveView(
              {
                designs: [
                  getNewSizePos(
                    getBoundingBox,
                    {
                      src: ev.target.result,
                      x: 0.25,
                      y: 0.25,
                      width: baseWidth,
                      height: baseHeight, // ✅ preserves aspect ratio
                      type: "upload",
                    },
                    activePreview,
                    regionWidth,
                    regionHeight,
                    0,
                  ),
                ],
              },
              imgRef,
              setSelectedDesignId,
              updateDesignsByView,
              activePreview,
            );
            setActiveTab("editUpload");
          };
          img.src = ev.target.result;
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div
      className={`upload-zone ${isDragging ? "dragging" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => {
        setIsDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);

        handleFiles(e.dataTransfer.files);
      }}
    >
      <div className="upload-actions">
        <button
          className={!isMobile ? "button" : "button mobile"}
          onClick={() => inputRef.current?.click()}
        >
          Upload from Device
        </button>

        <button
          className={!isMobile ? "button" : "button mobile"}
          onClick={openGoogleDrive}
        >
          Upload from Drive
        </button>
      </div>

      <p style={{ marginTop: "20px", color: "black" }}>
        Drag & drop images here
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handleFiles(e.target.files || [])}
      />
    </div>
  );
}
