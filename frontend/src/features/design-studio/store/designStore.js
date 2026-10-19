import { create } from 'zustand';

export const useDesignStore = create((set) => ({
    designTitle: 'Mẫu áo chưa đặt tên',
    garmentColor: '#F5F2DC',
    viewSide: 'front',
    showGrid: true,
    showBounds: true,

    // Ảnh texture render sang 3D
    frontTextureUrl: null,
    backTextureUrl: null,

    // JSON lưu các layer của canvas 2D
    frontCanvasData: null,
    backCanvasData: null,

    setDesignTitle: (title) => set({ designTitle: title }),
    setGarmentColor: (color) => set({ garmentColor: color }),
    setViewSide: (side) => set({ viewSide: side }),
    setShowBounds: (show) => set({ showBounds: show }),
    setShowGrid: (show) => set({ showGrid: show }),

    setFrontTextureUrl: (url) => set({ frontTextureUrl: url }),
    setBackTextureUrl: (url) => set({ backTextureUrl: url }),

    setFrontCanvasData: (data) => set({ frontCanvasData: data }),
    setBackCanvasData: (data) => set({ backCanvasData: data }),

    // Reset toàn bộ về trạng thái áo trắng trống trơn
    resetDesign: () => set({
        designTitle: 'Mẫu áo chưa đặt tên',
        garmentColor: '#F5F2DC',
        viewSide: 'front',
        frontTextureUrl: null,
        backTextureUrl: null,
        frontCanvasData: null,
        backCanvasData: null,
    })
}));