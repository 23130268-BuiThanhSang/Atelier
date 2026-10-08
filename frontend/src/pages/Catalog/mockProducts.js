/*
 * ================================================================
 * TEMPORARY MOCK DATA - DELETE THIS FILE WHEN PRODUCT API IS READY
 * ================================================================
 * Mô phỏng dữ liệu theo schema Product/Catalog:
 * categories, products, product_images, product_variants.
 * Không dùng file này khi chuyển sang API thật.
 */

export const MOCK_CATEGORIES = [
    { id: 1, name: 'Áo thun' },
    { id: 2, name: 'Hoodie' },
    { id: 3, name: 'Sweatshirt' },
    { id: 4, name: 'Polo' },
    { id: 5, name: 'Jacket' },
]

const RAW_MOCK_PRODUCTS = [
    {
        id: 1,
        categoryId: 1,
        name: 'Áo thun Heavyweight Basic',
        slug: 'ao-thun-heavyweight-basic',
        description: 'Áo thun heavyweight phom cơ bản, phù hợp cho thiết kế custom và sử dụng hằng ngày.',
        basePrice: 320000,
        status: 'ACTIVE',
        viewCount: 4620,
        soldCount: 980,
        createdAt: '2026-09-08T08:00:00Z',
        images: [
            'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=85',
            'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85',
        ],
        variants: [
            { id: 1001, sku: 'HWB-W-S', size: 'S', color: 'Trắng', price: 320000, stockQuantity: 35 },
            { id: 1002, sku: 'HWB-W-M', size: 'M', color: 'Trắng', price: 320000, stockQuantity: 40 },
            { id: 1003, sku: 'HWB-B-M', size: 'M', color: 'Đen', price: 330000, stockQuantity: 28 },
            { id: 1004, sku: 'HWB-B-L', size: 'L', color: 'Đen', price: 330000, stockQuantity: 24 },
        ],
    },
    {
        id: 2,
        categoryId: 1,
        name: 'Áo thun Oversized Natural',
        slug: 'ao-thun-oversized-natural',
        description: 'Phom oversized rộng rãi, màu trung tính, phù hợp với typography và graphic art.',
        basePrice: 380000,
        status: 'ACTIVE',
        viewCount: 3890,
        soldCount: 760,
        createdAt: '2026-09-12T10:30:00Z',
        images: [
            'https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1200&q=85',
            'https://images.unsplash.com/photo-1554568218-0f1715e72254?auto=format&fit=crop&w=1200&q=85',
        ],
        variants: [
            { id: 2001, sku: 'ONA-C-S', size: 'S', color: 'Kem', price: 380000, stockQuantity: 18 },
            { id: 2002, sku: 'ONA-C-M', size: 'M', color: 'Kem', price: 380000, stockQuantity: 22 },
            { id: 2003, sku: 'ONA-B-L', size: 'L', color: 'Đen', price: 390000, stockQuantity: 15 },
        ],
    },
    {
        id: 3,
        categoryId: 1,
        name: 'Áo thun Cotton Essential',
        slug: 'ao-thun-cotton-essential',
        description: 'Áo thun cotton cơ bản cho nhu cầu mặc hằng ngày và in thiết kế số lượng nhỏ.',
        basePrice: 290000,
        status: 'ACTIVE',
        viewCount: 5210,
        soldCount: 1180,
        createdAt: '2026-09-16T10:00:00Z',
        images: [
            'https://images.unsplash.com/photo-1527719327859-8e6a9d9f4a6f?auto=format&fit=crop&w=1200&q=85',
        ],
        variants: [
            { id: 3001, sku: 'ECE-W-S', size: 'S', color: 'Trắng', price: 290000, stockQuantity: 30 },
            { id: 3002, sku: 'ECE-W-M', size: 'M', color: 'Trắng', price: 290000, stockQuantity: 35 },
            { id: 3003, sku: 'ECE-G-M', size: 'M', color: 'Xám', price: 300000, stockQuantity: 20 },
        ],
    },
    {
        id: 4,
        categoryId: 1,
        name: 'Áo thun Minimal Premium',
        slug: 'ao-thun-minimal-premium',
        description: 'Chất liệu dày dặn và phom tối giản, phù hợp với thương hiệu hoặc bộ sưu tập riêng.',
        basePrice: 420000,
        status: 'ACTIVE',
        viewCount: 3120,
        soldCount: 640,
        createdAt: '2026-10-01T07:30:00Z',
        images: [
            'https://images.unsplash.com/photo-1583743814966-8936f37f65cc?auto=format&fit=crop&w=1200&q=85',
        ],
        variants: [
            { id: 4001, sku: 'MP-B-M', size: 'M', color: 'Đen', price: 420000, stockQuantity: 19 },
            { id: 4002, sku: 'MP-B-L', size: 'L', color: 'Đen', price: 420000, stockQuantity: 16 },
            { id: 4003, sku: 'MP-W-L', size: 'L', color: 'Trắng', price: 425000, stockQuantity: 11 },
        ],
    },
    {
        id: 5,
        categoryId: 2,
        name: 'Hoodie Essential Fleece',
        slug: 'hoodie-essential-fleece',
        description: 'Hoodie nỉ mềm, giữ form tốt, thích hợp cho bộ nhận diện nhóm và thiết kế custom.',
        basePrice: 590000,
        status: 'ACTIVE',
        viewCount: 6740,
        soldCount: 1420,
        createdAt: '2026-09-24T11:00:00Z',
        images: [
            'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1200&q=85',
        ],
        variants: [
            { id: 5001, sku: 'HEF-G-M', size: 'M', color: 'Xám', price: 590000, stockQuantity: 22 },
            { id: 5002, sku: 'HEF-G-L', size: 'L', color: 'Xám', price: 590000, stockQuantity: 18 },
            { id: 5003, sku: 'HEF-B-L', size: 'L', color: 'Đen', price: 600000, stockQuantity: 14 },
        ],
    },
    {
        id: 6,
        categoryId: 2,
        name: 'Hoodie Oversized Studio',
        slug: 'hoodie-oversized-studio',
        description: 'Hoodie oversized dành cho các thiết kế có diện tích artwork lớn và phong cách streetwear.',
        basePrice: 650000,
        status: 'ACTIVE',
        viewCount: 5980,
        soldCount: 890,
        createdAt: '2026-10-02T12:00:00Z',
        images: [
            'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1200&q=85',
        ],
        variants: [
            { id: 6001, sku: 'HOS-B-M', size: 'M', color: 'Đen', price: 650000, stockQuantity: 10 },
            { id: 6002, sku: 'HOS-B-L', size: 'L', color: 'Đen', price: 650000, stockQuantity: 9 },
            { id: 6003, sku: 'HOS-C-L', size: 'L', color: 'Kem', price: 660000, stockQuantity: 8 },
        ],
    },
    {
        id: 7,
        categoryId: 2,
        name: 'Hoodie Graphic Club',
        slug: 'hoodie-graphic-club',
        description: 'Hoodie dành cho câu lạc bộ, event và creator merchandise với diện tích in lớn.',
        basePrice: 690000,
        status: 'ACTIVE',
        viewCount: 4410,
        soldCount: 720,
        createdAt: '2026-09-21T15:00:00Z',
        images: [
            'https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=1200&q=85',
        ],
        variants: [
            { id: 7001, sku: 'HGC-B-M', size: 'M', color: 'Đen', price: 690000, stockQuantity: 12 },
            { id: 7002, sku: 'HGC-B-L', size: 'L', color: 'Đen', price: 690000, stockQuantity: 10 },
        ],
    },
    {
        id: 8,
        categoryId: 3,
        name: 'Sweatshirt Daily Comfort',
        slug: 'sweatshirt-daily-comfort',
        description: 'Sweatshirt nhẹ và dễ phối, phù hợp với thiết kế tối giản hoặc typography.',
        basePrice: 490000,
        status: 'ACTIVE',
        viewCount: 3560,
        soldCount: 540,
        createdAt: '2026-09-19T14:00:00Z',
        images: [
            'https://images.unsplash.com/photo-1578681994506-b8f463449011?auto=format&fit=crop&w=1200&q=85',
        ],
        variants: [
            { id: 8001, sku: 'SDC-G-M', size: 'M', color: 'Xám', price: 490000, stockQuantity: 14 },
            { id: 8002, sku: 'SDC-G-L', size: 'L', color: 'Xám', price: 495000, stockQuantity: 11 },
        ],
    },
    {
        id: 9,
        categoryId: 3,
        name: 'Sweatshirt Graphic Ready',
        slug: 'sweatshirt-graphic-ready',
        description: 'Bề mặt ổn định để thử nghiệm artwork, phù hợp với custom graphic và logo.',
        basePrice: 520000,
        status: 'ACTIVE',
        viewCount: 4890,
        soldCount: 610,
        createdAt: '2026-10-03T08:30:00Z',
        images: [
            'https://images.unsplash.com/photo-1543076447-215ad9ba6923?auto=format&fit=crop&w=1200&q=85',
        ],
        variants: [
            { id: 9001, sku: 'SGR-C-M', size: 'M', color: 'Kem', price: 520000, stockQuantity: 16 },
            { id: 9002, sku: 'SGR-C-L', size: 'L', color: 'Kem', price: 525000, stockQuantity: 13 },
        ],
    },
    {
        id: 10,
        categoryId: 4,
        name: 'Polo Classic Cotton',
        slug: 'polo-classic-cotton',
        description: 'Polo cotton cổ điển, phù hợp với nhận diện đội nhóm, startup và doanh nghiệp nhỏ.',
        basePrice: 450000,
        status: 'ACTIVE',
        viewCount: 2780,
        soldCount: 680,
        createdAt: '2026-09-14T09:00:00Z',
        images: [
            'https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=1200&q=85',
        ],
        variants: [
            { id: 10001, sku: 'PCC-W-M', size: 'M', color: 'Trắng', price: 450000, stockQuantity: 20 },
            { id: 10002, sku: 'PCC-B-L', size: 'L', color: 'Đen', price: 460000, stockQuantity: 18 },
        ],
    },
    {
        id: 11,
        categoryId: 4,
        name: 'Polo Modern Fit',
        slug: 'polo-modern-fit',
        description: 'Polo phom hiện đại, phù hợp với thiết kế tối giản và branding chuyên nghiệp.',
        basePrice: 490000,
        status: 'ACTIVE',
        viewCount: 3360,
        soldCount: 530,
        createdAt: '2026-10-04T13:20:00Z',
        images: [
            'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=85',
        ],
        variants: [
            { id: 11001, sku: 'PMF-N-M', size: 'M', color: 'Navy', price: 490000, stockQuantity: 14 },
            { id: 11002, sku: 'PMF-N-L', size: 'L', color: 'Navy', price: 490000, stockQuantity: 12 },
        ],
    },
    {
        id: 12,
        categoryId: 5,
        name: 'Coach Jacket Atelier',
        slug: 'coach-jacket-atelier',
        description: 'Coach jacket nhẹ, phù hợp với logo nhỏ, typography và graphic ở mặt lưng.',
        basePrice: 720000,
        status: 'ACTIVE',
        viewCount: 4030,
        soldCount: 410,
        createdAt: '2026-09-28T16:00:00Z',
        images: [
            'https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=1200&q=85',
        ],
        variants: [
            { id: 12001, sku: 'CJA-B-M', size: 'M', color: 'Đen', price: 720000, stockQuantity: 9 },
            { id: 12002, sku: 'CJA-B-L', size: 'L', color: 'Đen', price: 720000, stockQuantity: 7 },
        ],
    },
    {
        id: 13,
        categoryId: 5,
        name: 'Utility Jacket Custom',
        slug: 'utility-jacket-custom',
        description: 'Utility jacket nhiều chi tiết, dành cho các bộ sưu tập custom có phong cách mạnh.',
        basePrice: 890000,
        status: 'ACTIVE',
        viewCount: 2540,
        soldCount: 260,
        createdAt: '2026-09-25T10:15:00Z',
        images: [
            'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1200&q=85',
        ],
        variants: [
            { id: 13001, sku: 'UJC-O-M', size: 'M', color: 'Olive', price: 890000, stockQuantity: 6 },
            { id: 13002, sku: 'UJC-O-L', size: 'L', color: 'Olive', price: 890000, stockQuantity: 5 },
        ],
    },
    {
        id: 14,
        categoryId: 1,
        name: 'Áo thun Graphic Signature',
        slug: 'ao-thun-graphic-signature',
        description: 'Áo thun dành cho artwork nổi bật, phù hợp với creator merchandise và design collection.',
        basePrice: 350000,
        status: 'ACTIVE',
        viewCount: 7420,
        soldCount: 1560,
        createdAt: '2026-10-05T09:10:00Z',
        images: [
            'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=1200&q=85',
        ],
        variants: [
            { id: 14001, sku: 'AGS-W-M', size: 'M', color: 'Trắng', price: 350000, stockQuantity: 32 },
            { id: 14002, sku: 'AGS-B-M', size: 'M', color: 'Đen', price: 355000, stockQuantity: 27 },
            { id: 14003, sku: 'AGS-B-L', size: 'L', color: 'Đen', price: 355000, stockQuantity: 24 },
        ],
    },
    {
        id: 15,
        categoryId: 4,
        name: 'Polo Creator Edition',
        slug: 'polo-creator-edition',
        description: 'Phiên bản polo hướng đến creator và thương hiệu cá nhân, ưu tiên cảm giác sạch và cao cấp.',
        basePrice: 560000,
        status: 'ACTIVE',
        viewCount: 6120,
        soldCount: 820,
        createdAt: '2026-10-05T15:20:00Z',
        images: [
            'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=85',
        ],
        variants: [
            { id: 15001, sku: 'PCE-W-M', size: 'M', color: 'Trắng', price: 560000, stockQuantity: 18 },
            { id: 15002, sku: 'PCE-N-L', size: 'L', color: 'Navy', price: 570000, stockQuantity: 15 },
        ],
    },
]


// ============================================================================
// MOCK PREVIEW UI MAPPING
// Giữ nguyên dữ liệu gần với schema DB, đồng thời bổ sung field để UI hiện tại
// (ProductCard / ProductDetail) có thể hiển thị mà chưa cần API thật.
// XÓA TOÀN BỘ KHỐI MOCK NÀY KHI PRODUCT API ĐƯỢC KẾT NỐI.
// ============================================================================
export const MOCK_PRODUCTS = RAW_MOCK_PRODUCTS.map((product) => {
    const category = MOCK_CATEGORIES.find((item) => item.id === product.categoryId)
    const colors = [...new Set(product.variants.map((variant) => variant.color))]
    const sizes = [...new Set(product.variants.map((variant) => variant.size))]

    return {
        ...product,
        categoryName: category?.name || 'Sản phẩm',
        price: product.basePrice,
        imageUrl: product.images[0] || '',
        imageUrls: product.images,
        colors,
        sizes,
    }
})
