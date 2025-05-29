// types/panolens.d.ts
export {};

declare global {
  const PANOLENS: typeof import("panolens");

  namespace PANOLENS {
    class ImagePanorama {
      constructor(imageUrl: string);
      addEventListener(type: string, callback: (event: any) => void): void;
      removeEventListener(type: string, callback: (event: any) => void): void;
      lookAt(x: number, y: number, z: number): void;
    }

    class Viewer {
      constructor(options?: {
        container?: HTMLElement;
        controlBar?: boolean;
        autoHideInfospot?: boolean;
        cameraFov?: number;
        output?: string;
      });

      add(panorama: ImagePanorama): void;
      setPanorama(panorama: ImagePanorama): void;
      remove(panorama: ImagePanorama): void;
      dispose(): void;
    }
  }
}
