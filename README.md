# Atelier

Nền tảng thiết kế trang phục, xem trước 3D và đặt may theo yêu cầu.

- **Backend:** Spring Boot (Java 21, Maven)
- **Frontend:** React (Vite, JavaScript)
- **Phạm vi:** chạy trên máy cá nhân (local). Hiện **chưa kết nối database**.

---

## 1. Công nghệ và thư viện đang dùng

### Backend

| Thư viện | Dùng để làm gì |
|---|---|
| Spring Web | Viết các API (REST) cho frontend gọi |
| Validation | Kiểm tra dữ liệu gửi lên (không rỗng, độ dài, định dạng email...) |
| Lombok | Tự sinh getter/setter/constructor, giúp code ngắn hơn |
| Spring Boot DevTools | Tự khởi động lại backend khi sửa code |

Phiên bản Spring Boot và danh sách thư viện đầy đủ xem trong `backend/pom.xml`.

### Frontend

| Thư viện | Dùng để làm gì |
|---|---|
| React | Xây dựng giao diện |
| Vite | Công cụ build và chạy thử (dev server) |
| axios | Gọi API sang backend |
| react-router-dom | Chuyển trang (đăng nhập, giỏ hàng, ...) |
| @tanstack/react-query | Lấy và lưu tạm dữ liệu từ server (tự xử lý đang tải, lỗi) |
| zustand | Lưu trạng thái giao diện (ví dụ các lớp trong Design Studio) |
| Tailwind CSS | Viết giao diện bằng class, không viết CSS riêng |
| ESLint | Kiểm tra lỗi và chuẩn code JavaScript |

Danh sách đầy đủ và phiên bản xem trong `frontend/package.json`.

### Dự kiến thêm sau (chưa cài)

| Thư viện | Dùng để làm gì | Thêm khi nào |
|---|---|---|
| Spring Data JPA, MySQL Driver | Làm việc với database | Khi nối database |
| Spring Security (+ JWT) | Đăng ký, đăng nhập, phân quyền | Khi làm chức năng tài khoản |
| three, @react-three/fiber, @react-three/drei | Xem trước áo 3D | Khi làm Design Studio |
| fabric | Canvas chỉnh sửa thiết kế 2D | Khi làm Design Studio |

> **Lưu ý:** không tự ý thêm Spring Data JPA hoặc MySQL Driver vào `pom.xml` khi chưa có cấu hình database, vì backend sẽ **không khởi động được**.

---

## 2. Yêu cầu cài đặt (mỗi người cài một lần)

| Công cụ | Phiên bản | Ghi chú |
|---|---|---|
| Git | Bản mới | |
| JDK | **21** | Có thể để IntelliJ tải: File → Project Structure → SDK → Download JDK → 21 |
| Node.js | **20 LTS trở lên** | Tải bản LTS ở nodejs.org |
| IntelliJ IDEA | Bản bất kỳ | Dùng cho backend |
| VS Code | Bản mới (tùy chọn) | Nên dùng cho frontend nếu IntelliJ là bản Community |

Không cần cài Maven, vì đã có sẵn `mvnw` trong thư mục `backend`.

---

## 3. Cấu trúc thư mục (cả nhóm thống nhất theo sơ đồ này)

### 3.1. Sơ đồ đầy đủ

```
Project_Ecormerce_Atrlier/
├── backend/                                   # Spring Boot
│   ├── pom.xml                                # Khai báo thư viện backend
│   ├── mvnw, mvnw.cmd, .mvn/                  # Maven Wrapper (khỏi cài Maven)
│   └── src/
│       ├── main/
│       │   ├── java/com/atelier/
│       │   │   ├── BackendApplication.java    # Điểm chạy của backend
│       │   │   ├── common/                    # Dùng chung cho mọi tính năng
│       │   │   │   ├── PingController.java    # API thử kết nối
│       │   │   │   ├── config/                # Cấu hình (CORS, Security...)
│       │   │   │   ├── exception/             # Xử lý lỗi chung
│       │   │   │   └── response/              # Khuôn phản hồi chung
│       │   │   ├── auth/dto/                  # Đăng ký, đăng nhập
│       │   │   ├── user/dto/                  # Người dùng
│       │   │   ├── catalog/dto/               # Sản phẩm nền (áo, màu, size)
│       │   │   ├── design/dto/                # Thiết kế của người dùng
│       │   │   ├── cart/dto/                  # Giỏ hàng
│       │   │   ├── order/dto/                 # Đơn hàng
│       │   │   ├── payment/dto/               # Thanh toán
│       │   │   ├── production/dto/            # Sản xuất, tiến độ xưởng
│       │   │   ├── file/                      # Upload ảnh
│       │   │   └── admin/                     # Quản trị, thống kê
│       │   └── resources/
│       │       └── application.yaml           # Cấu hình ứng dụng
│       └── test/java/com/atelier/             # Test (cấu trúc package giống main)
│
├── frontend/                                  # React (Vite)
│   ├── package.json, package-lock.json        # Khai báo thư viện frontend
│   ├── vite.config.js                         # Cấu hình Vite và proxy sang backend
│   ├── index.html
│   ├── public/
│   │   └── models/                            # Mô hình áo 3D (.glb)
│   └── src/
│       ├── main.jsx, App.jsx                  # Điểm vào của ứng dụng
│       ├── api/                               # Nơi DUY NHẤT gọi backend
│       ├── routes/                            # Khai báo đường dẫn trang
│       ├── hooks/                             # Custom hook dùng chung
│       ├── context/                           # Context dùng chung (đăng nhập)
│       ├── utils/                             # Hàm tiện ích
│       ├── constants/                         # Hằng số
│       ├── components/
│       │   ├── layout/                        # Bố cục: Navbar, Footer...
│       │   └── ui/                            # Nút, modal, thẻ sản phẩm...
│       ├── features/
│       │   └── design-studio/                 # Tính năng thiết kế áo
│       │       ├── components/                # Canvas 2D, xem 3D, thanh công cụ
│       │       ├── hooks/
│       │       └── store/                     # Trạng thái thiết kế (zustand)
│       └── pages/                             # Mỗi trang một thư mục
│           ├── Home/  Catalog/  ProductDetail/
│           ├── DesignStudio/  MyDesigns/
│           ├── Cart/  Checkout/  MyOrders/
│           ├── Login/  Register/
│           └── admin/
│
├── .gitignore                                 # Danh sách không đẩy lên Git
├── .gitattributes, .editorconfig              # Thống nhất xuống dòng, thụt lề
└── README.md                                  # File này
```

Thư mục nào đang rỗng sẽ có file `.gitkeep` bên trong để Git lưu được. Khi thư mục đã có file thật, có thể xóa `.gitkeep`.

### 3.2. Ý nghĩa các thư mục Backend

| Thư mục | Chứa gì | Ví dụ |
|---|---|---|
| `common/config` | Cấu hình dùng chung | `SecurityConfig`, `CorsConfig` |
| `common/exception` | Class lỗi và bộ xử lý lỗi chung | `BusinessException`, `GlobalExceptionHandler` |
| `common/response` | Khuôn dữ liệu trả về chung | `ApiResponse` |
| `auth` | Đăng ký, đăng nhập | `AuthController`, `AuthService` |
| `user` | Thông tin người dùng | `UserController`, `UserService` |
| `catalog` | Sản phẩm nền để thiết kế | `ProductController`, `ProductService` |
| `design` | Thiết kế người dùng tạo ra | `DesignController`, `DesignService` |
| `cart`, `order`, `payment` | Giỏ hàng, đơn hàng, thanh toán | `OrderService` |
| `production` | Theo dõi tiến độ sản xuất | `ProductionService` |
| `file` | Upload và lưu ảnh | `FileController` |
| `admin` | Chức năng quản trị | `AdminController` |
| `<tính năng>/dto` | Class dữ liệu vào/ra của API | `CreateDesignRequest`, `DesignResponse` |

### 3.3. Ý nghĩa các thư mục Frontend

| Thư mục | Chứa gì | Ví dụ |
|---|---|---|
| `api` | Các hàm gọi backend, mỗi tính năng một file | `authApi.js`, `designApi.js` |
| `routes` | Danh sách đường dẫn và route cần đăng nhập | `AppRoutes.jsx`, `ProtectedRoute.jsx` |
| `hooks` | Hook dùng ở nhiều nơi | `useAuth.js`, `useDebounce.js` |
| `context` | Dữ liệu chia sẻ toàn ứng dụng | `AuthContext.jsx` |
| `utils` | Hàm thuần, không liên quan giao diện | `formatCurrency.js` |
| `constants` | Hằng số | `orderStatus.js` |
| `components/layout` | Bố cục chung của trang | `Navbar.jsx`, `Footer.jsx` |
| `components/ui` | Thành phần nhỏ dùng lại nhiều nơi | `Button.jsx`, `Modal.jsx` |
| `features/design-studio` | Toàn bộ phần thiết kế áo (canvas 2D, xem 3D) | `CanvasEditor.jsx`, `Viewer3D.jsx`, `designStore.js` |
| `pages/<Tên>` | Mỗi trang một thư mục | `pages/Cart/Cart.jsx` |
| `public/models` | Mô hình 3D | `tshirt.glb` |

### 3.4. Quy tắc thống nhất

1. **Không tạo thêm thư mục cấp cao** (cạnh `backend`, `frontend`) khi chưa thống nhất với nhóm.
2. **Backend theo tính năng:** code của một tính năng nằm trong package của tính năng đó. Các file như Controller, Service, Repository, Entity đặt **trực tiếp** trong package (ví dụ `design/DesignService.java`), còn DTO đặt trong `dto/`.
3. **Cần thêm package mới** (ví dụ `common/security`, `common/util`) thì tạo trong `com.atelier` theo đúng mẫu trên và báo nhóm.
4. **Frontend:** mỗi trang là một thư mục trong `pages/`, file chính trùng tên thư mục (`pages/Cart/Cart.jsx`). Phần chỉ dùng cho một tính năng lớn thì đặt trong `features/`; dùng ở nhiều nơi thì đặt trong `components/`.
5. **Gọi backend chỉ qua `src/api/`**, không gọi trực tiếp trong component.
6. **Tên thư mục và file** theo bảng quy ước ở mục 5.3 và 6.3.
7. Muốn đổi cấu trúc thư mục thì **sửa sơ đồ ở mục này trong cùng Pull Request**, để README luôn đúng với thực tế.

---

## 4. Cách chạy dự án

### 4.1. Lần đầu sau khi clone

**Backend (IntelliJ):**

1. Mở thư mục dự án: **File → Open**.
2. Chuột phải `backend/pom.xml` → **Add as Maven Project**, đợi tải thư viện xong (lần đầu mất vài phút, cần Internet).
3. Chọn JDK 21: **File → Project Structure → Project → SDK**.
4. Bật Lombok: **File → Settings → Build, Execution, Deployment → Compiler → Annotation Processors** → tick **Enable annotation processing**.

> Bước 3 và 4 **mỗi người phải tự làm** trên máy mình, vì cài đặt IntelliJ (thư mục `.idea`) không được đẩy lên Git.

**Frontend:**

```bash
cd frontend
npm install
```

> Bắt buộc chạy `npm install` sau khi clone, vì thư mục `node_modules` không có trên Git.

### 4.2. Chạy hằng ngày

Cần mở **hai cửa sổ** chạy cùng lúc.

**Backend** (cổng 8080), có hai cách:

- Cách 1 (IntelliJ): mở `BackendApplication.java`, bấm nút **▶** cạnh hàm `main`.
- Cách 2 (dòng lệnh):

```bash
cd backend
./mvnw spring-boot:run          # Mac/Linux
.\mvnw spring-boot:run          # Windows PowerShell
```

**Frontend** (cổng 5173):

```bash
cd frontend
npm run dev
```

### 4.3. Kiểm tra

| Kiểm tra | Địa chỉ | Kết quả đúng |
|---|---|---|
| Backend | http://localhost:8080/api/v1/ping | `{"message":"Atelier backend OK"}` |
| Frontend | http://localhost:5173 | Trang hiện chữ "Atelier backend OK" |

Frontend gọi backend thông qua **proxy** cấu hình trong `frontend/vite.config.js`: mọi yêu cầu bắt đầu bằng `/api` được chuyển sang `http://localhost:8080`. Nhờ vậy không gặp lỗi CORS khi code.

### 4.4. Lỗi thường gặp

| Hiện tượng | Cách xử lý |
|---|---|
| Chữ đỏ ở `@Getter`, `@RequiredArgsConstructor` | Chưa bật Annotation Processing (xem 4.1, bước 4) |
| Chữ đỏ khắp nơi trong code Java | Chưa Add as Maven Project, hoặc Maven chưa tải xong |
| `Port 8080 was already in use` | Đang chạy một bản backend khác, tắt nó (nút ■ đỏ) |
| `npm run dev` báo lỗi thiếu module | Chưa chạy `npm install` |
| Trang React hiện "Không kết nối được Backend" | Backend chưa chạy, hoặc chưa chạy lại `npm run dev` sau khi sửa `vite.config.js` |
| Backend báo lỗi liên quan `DataSource` | Đã lỡ thêm JPA/MySQL vào `pom.xml` khi chưa có database |

---

## 5. Quy ước code Backend

### 5.1. Tổ chức theo tính năng

Mỗi tính năng một package, trong đó có đủ bộ file:

```
design/
├── Design.java               # Entity (khi có database)
├── DesignRepository.java     # Truy cập dữ liệu (khi có database)
├── DesignService.java        # Xử lý nghiệp vụ
├── DesignController.java     # Khai báo API
└── dto/
    ├── CreateDesignRequest.java
    └── DesignResponse.java
```

### 5.2. Phân tầng

Luồng một chiều: **Controller → Service → Repository**.

| Tầng | Làm gì | Không làm |
|---|---|---|
| Controller | Nhận request, validate (`@Valid`), gọi Service, trả kết quả | Không viết logic, không gọi Repository |
| Service | Xử lý nghiệp vụ, kiểm tra quyền, ném lỗi nghiệp vụ | Không dùng gì của HTTP |
| Repository | Đọc/ghi database | Không viết logic nghiệp vụ |
| DTO | Dữ liệu vào/ra của API (dùng `record`) | Không chứa annotation database |

- **Không trả Entity ra API**, luôn dùng DTO.
- Tính năng này cần tính năng khác thì gọi qua **Service**, không gọi thẳng Repository của người khác.
- Dùng **constructor injection** (`@RequiredArgsConstructor`), không dùng `@Autowired` trên field.

### 5.3. Đặt tên

| Đối tượng | Quy tắc | Ví dụ |
|---|---|---|
| Package | Chữ thường, theo tính năng | `com.atelier.design` |
| Class | PascalCase, có hậu tố vai trò | `DesignService`, `DesignController` |
| DTO | `<Hành động><Đối tượng>Request/Response` | `CreateDesignRequest`, `DesignResponse` |
| Phương thức, biến | camelCase, phương thức bắt đầu bằng động từ | `createDesign()`, `totalPrice` |
| Hằng số, giá trị enum | UPPER_SNAKE_CASE | `IN_PRODUCTION` |
| URL API | Danh từ số nhiều, chữ thường, kebab-case, tiền tố `/api/v1` | `/api/v1/designs` |
| Trường JSON | camelCase | `productId`, `createdAt` |

Không dùng động từ trong URL: `POST /api/v1/designs` (đúng), `POST /api/v1/createDesign` (sai).

### 5.4. Mẫu code

```java
// dto/CreateDesignRequest.java
public record CreateDesignRequest(
    @NotBlank(message = "Tên thiết kế không được để trống")
    @Size(max = 100, message = "Tên tối đa 100 ký tự") String name,
    @NotBlank String designJson) {}

// DesignController.java: chỉ nhận và trả, không có logic
@RestController
@RequestMapping("/api/v1/designs")
@RequiredArgsConstructor
public class DesignController {
    private final DesignService designService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public DesignResponse create(@Valid @RequestBody CreateDesignRequest req) {
        return designService.create(req);
    }
}
```

### 5.5. Mã trạng thái HTTP

| Mã | Dùng khi |
|---|---|
| 200 / 201 / 204 | Thành công / Tạo mới thành công / Xóa thành công |
| 400 | Dữ liệu gửi lên sai |
| 401 | Chưa đăng nhập hoặc hết hạn |
| 403 | Không đủ quyền |
| 404 | Không tìm thấy dữ liệu |
| 409 | Trùng dữ liệu (ví dụ email đã tồn tại) |

### 5.6. Điều cần nhớ

- **Tiền dùng `BigDecimal` hoặc số nguyên VND**, không dùng `double`.
- Mật khẩu và khóa bí mật **không ghi cứng trong code đẩy lên Git** (dùng file `application-local.yaml` đã được `.gitignore` bỏ qua, hoặc biến môi trường).
- Không để lại `System.out.println`; cần ghi log thì dùng SLF4J (`@Slf4j` của Lombok).

---

## 6. Quy ước code Frontend

### 6.1. Nơi đặt code

| Loại code | Đặt ở |
|---|---|
| Một trang (ghép bố cục, gọi hook) | `src/pages/` |
| Giao diện dùng ở nhiều trang (nút, modal, thẻ sản phẩm) | `src/components/` |
| Logic và giao diện riêng của một tính năng lớn (Design Studio) | `src/features/<tính-năng>/` |
| Hàm gọi backend | `src/api/` |
| Hàm thuần không liên quan giao diện | `src/utils/` |

### 6.2. Quy tắc

- **Gọi API chỉ qua thư mục `src/api/`.** Không dùng `axios` trực tiếp trong component.
- Dữ liệu lấy từ server (sản phẩm, đơn hàng) dùng **react-query**. Trạng thái giao diện dùng `useState` hoặc **zustand**.
- Mỗi màn hình có dữ liệu bất đồng bộ phải xử lý đủ 3 trạng thái: **đang tải, lỗi, rỗng**.
- Không viết cứng địa chỉ backend. Chỉ gọi đường dẫn bắt đầu bằng `/api/v1/...` (đã có proxy).
- Component dài quá khoảng 200 dòng thì tách nhỏ.
- Chạy `npm run lint` trước khi commit, không để lại cảnh báo.
- **Viết giao diện bằng Tailwind** (class như `flex`, `p-4`, `border`), không tạo file CSS riêng cho từng trang.
- `main.jsx` đã bọc sẵn `QueryClientProvider` và `BrowserRouter`, `AppRoutes.jsx` đã khai báo đường dẫn cho các trang. Chỉ sửa các file này khi thêm trang mới và báo nhóm.

### 6.3. Đặt tên

| Đối tượng | Quy tắc | Ví dụ |
|---|---|---|
| Component (file và hàm) | PascalCase, đuôi `.jsx` | `ProductCard.jsx` |
| Hook | camelCase, bắt đầu bằng `use` | `useMyDesigns.js` |
| File gọi API | `<tên>Api.js` | `designApi.js` |
| Store zustand | `<tên>Store.js` | `designStore.js` |
| Biến boolean | Bắt đầu bằng `is`, `has`, `should` | `isLoading` |
| Hàm xử lý sự kiện | `handle...` (bên trong), `on...` (prop truyền xuống) | `handleSave`, `onSave` |
| Hằng số | UPPER_SNAKE_CASE | `ORDER_STATUS` |
| Đường dẫn trang | kebab-case | `/my-designs` |

### 6.4. Mẫu code

```jsx
// src/api/designApi.js
import axios from 'axios'

export const designApi = {
  getMine: () => axios.get('/api/v1/designs').then((res) => res.data),
  create: (body) => axios.post('/api/v1/designs', body).then((res) => res.data),
}
```

```jsx
// src/pages/MyDesigns/MyDesigns.jsx
import { useQuery } from '@tanstack/react-query'
import { designApi } from '../../api/designApi'

export default function MyDesigns() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['designs', 'mine'],
    queryFn: designApi.getMine,
  })

  if (isLoading) return <p>Đang tải...</p>
  if (isError) return <p>Có lỗi xảy ra</p>
  if (!data.length) return <p>Bạn chưa có thiết kế nào</p>

  return (
    <ul>
      {data.map((d) => <li key={d.id}>{d.name}</li>)}
    </ul>
  )
}
```

> `QueryClientProvider` đã được bọc sẵn trong `main.jsx`, không cần thêm lại.

---

## 7. Thêm thư viện mới

- **Backend:** thêm dependency vào `backend/pom.xml`, rồi bấm biểu tượng **Reload** của Maven trong IntelliJ.
- **Frontend:** chạy `npm install <tên-thư-viện>` trong thư mục `frontend`.
- Sau khi thêm, **commit cả `pom.xml` hoặc `package.json` và `package-lock.json`**, rồi báo cả nhóm. Thành viên khác kéo code về thì chạy lại `npm install` (frontend) hoặc reload Maven (backend).
- Cập nhật bảng thư viện ở mục 1 của README này.
- Không thêm thư viện chỉ để dùng một lần; hỏi nhóm trước nếu thư viện nặng.

---

## 8. Lưu ý khi làm việc nhóm

- **Không push thẳng vào `main`.** Tạo nhánh riêng, ví dụ `feature/auth-login`, làm xong gửi Pull Request.
- Một nhánh chỉ làm **một việc**; mỗi người nhận một tính năng riêng để ít đụng file của nhau.
- Thông điệp commit theo dạng `<loại>: <mô tả>`:
  - `feat: thêm API lưu thiết kế`
  - `fix: sửa lỗi tính tổng tiền`
  - `docs: cập nhật README`
- Trước khi commit, chạy `git status` và kiểm tra **không có** các thứ sau:
  - `.idea/`, `*.iml`
  - `node_modules/`, `target/`
  - Mật khẩu, khóa bí mật, file `.env`
- Trước khi gửi PR, **chạy thử cả backend lẫn frontend** và chắc rằng không có lỗi.
- Kéo code mới về thường xuyên (`git pull`) để giảm xung đột.

---

## 9. Phân chia thư mục khi làm việc

Để tránh hai người sửa cùng một file, mỗi người phụ trách theo tính năng:

| Tính năng | Backend | Frontend |
|---|---|---|
| Đăng ký, đăng nhập | `auth/`, `user/` | `pages/Login`, `pages/Register`, `api/authApi.js` |
| Sản phẩm | `catalog/` | `pages/Catalog`, `pages/ProductDetail` |
| Thiết kế | `design/` | `features/design-studio/`, `pages/DesignStudio`, `pages/MyDesigns` |
| Giỏ hàng, đơn hàng | `cart/`, `order/` | `pages/Cart`, `pages/Checkout`, `pages/MyOrders` |

File dùng chung (`pom.xml`, `package.json`, `App.jsx`, `vite.config.js`) chỉ sửa khi cần và báo cho nhóm.

### Phân công Frontend (điền tên thành viên)

| Người phụ trách | Phạm vi |
|---|---|
| ........ | `pages/Login`, `pages/Register`, `components/layout/MainLayout.jsx`, `api/authApi.js` |
| ........ | `pages/Home`, `pages/Catalog`, `pages/ProductDetail`, `api/productApi.js` |
| ........ | `features/design-studio/`, `pages/DesignStudio`, `api/designApi.js` |
| ........ | `pages/Cart`, `pages/Checkout`, `pages/MyOrders`, `pages/MyDesigns`, `api/cartApi.js`, `api/orderApi.js` |

Mỗi người chỉ sửa các thư mục của mình. Cần sửa file của người khác thì nhắn người đó trước.

---

## 10. Thống nhất dữ liệu API (hợp đồng giữa Frontend và Backend)

> **Đây là bản nháp để cả nhóm chốt.** Sau khi chốt, hai bên cùng làm theo. Muốn đổi tên trường hoặc kiểu dữ liệu thì phải báo nhóm và **sửa mục này trong cùng Pull Request**.

### 10.1. Quy tắc chung

- Đường dẫn bắt đầu bằng `/api/v1`. Tên trường JSON dùng **camelCase**.
- **Thành công:** trả thẳng dữ liệu (không bọc thêm lớp ngoài).
- **Tiền:** số nguyên, đơn vị VND (ví dụ `150000`). Không dùng số thập phân.
- **Thời gian:** chuỗi ISO-8601, ví dụ `"2026-10-04T08:30:00Z"`.
- **Lỗi:** trả mã HTTP phù hợp (400, 401, 403, 404, 409) kèm nội dung:

```json
{ "code": "DESIGN_NOT_FOUND", "message": "Không tìm thấy thiết kế" }
```

Lỗi nhập sai dữ liệu (mã 400) có thêm danh sách `errors`:

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Dữ liệu không hợp lệ",
  "errors": [ { "field": "email", "message": "Email không đúng định dạng" } ]
}
```

- Các API cần đăng nhập gửi kèm header `Authorization: Bearer <accessToken>`.

### 10.2. Tài khoản

| API | Gửi lên | Trả về |
|---|---|---|
| `POST /api/v1/auth/register` | `{ "fullName", "email", "password" }` | 201: `{ "id", "fullName", "email" }` |
| `POST /api/v1/auth/login` | `{ "email", "password" }` | 200: `{ "accessToken", "user": { "id", "fullName", "email", "role" } }` |

`role` nhận một trong các giá trị: `USER`, `ADMIN`.

### 10.3. Sản phẩm

`GET /api/v1/products` trả về danh sách:

```json
[
  { "id": 1, "name": "Áo thun basic", "price": 150000, "imageUrl": "https://..." }
]
```

`GET /api/v1/products/{id}` trả về chi tiết:

```json
{
  "id": 1,
  "name": "Áo thun basic",
  "description": "Áo thun cotton 100%",
  "price": 150000,
  "imageUrl": "https://...",
  "modelUrl": "/models/tshirt.glb",
  "colors": [ { "name": "Trắng", "hex": "#FFFFFF" } ],
  "sizes": ["S", "M", "L", "XL"]
}
```

### 10.4. Thiết kế

| API | Gửi lên | Trả về |
|---|---|---|
| `GET /api/v1/designs` | (không) | Danh sách `[ { "id", "name", "productId", "previewUrl", "createdAt" } ]` |
| `GET /api/v1/designs/{id}` | (không) | `{ "id", "name", "productId", "previewUrl", "designJson", "createdAt" }` |
| `POST /api/v1/designs` | `{ "name", "productId", "designJson", "previewUrl" }` | 201: như `GET /designs/{id}` |
| `PUT /api/v1/designs/{id}` | Như `POST` | 200: như `GET /designs/{id}` |
| `DELETE /api/v1/designs/{id}` | (không) | 204 |

`designJson` là một **chuỗi JSON** mô tả thiết kế. Backend lưu nguyên khối, không cần hiểu bên trong. Cấu trúc do nhóm Design Studio quyết định, ví dụ bản 1:

```json
{
  "version": 1,
  "variantId": 34,
  "baseColor": "#FFFFFF",
  "layers": [
    { "id": "layer-1", "type": "text", "content": "Atelier",
      "x": 120, "y": 80, "rotation": 0,
      "fontFamily": "Arial", "fontSize": 32, "color": "#111111" },
    { "id": "layer-2", "type": "image", "assetId": 55,
      "x": 200, "y": 160, "width": 180, "height": 180, "rotation": 15 }
  ]
}
```

Muốn đổi cấu trúc này thì **tăng `version`** và báo cả nhóm.

### 10.5. Giỏ hàng và đơn hàng

| API | Gửi lên | Trả về |
|---|---|---|
| `GET /api/v1/cart` | (không) | `{ "items": [ { "id", "designId", "productName", "previewUrl", "size", "quantity", "unitPrice" } ], "totalPrice" }` |
| `POST /api/v1/cart/items` | `{ "designId", "size", "quantity" }` | 201: giỏ hàng mới (như `GET /cart`) |
| `DELETE /api/v1/cart/items/{id}` | (không) | 204 |
| `POST /api/v1/orders` | `{ "receiverName", "phone", "address", "note", "paymentMethod" }` | 201: `{ "id", "status", "totalPrice", "createdAt" }` |
| `GET /api/v1/orders` | (không) | Danh sách `[ { "id", "status", "totalPrice", "createdAt" } ]` |
| `PATCH /api/v1/orders/{id}/cancel` | (không) | 200: đơn hàng sau khi hủy |

- `paymentMethod`: tạm thời chỉ có `COD` (thanh toán khi nhận hàng).
- `status` nhận một trong các giá trị: `PENDING`, `CONFIRMED`, `IN_PRODUCTION`, `SHIPPING`, `COMPLETED`, `CANCELLED`.

---

## 11. Giao diện chung (Frontend)

> **Bản nháp để nhóm chốt.** Chốt xong thì mọi người dùng đúng các giá trị dưới đây, không tự chọn màu và kiểu riêng.

### 11.1. Bảng màu và kiểu dáng (Tailwind)

| Thành phần | Class Tailwind | Ghi chú |
|---|---|---|
| Màu chính (nút, link nổi bật) | `bg-indigo-600`, `text-indigo-600` | Đổi ở đây nếu nhóm chọn màu khác |
| Chữ thường | `text-slate-900` | |
| Chữ phụ | `text-slate-500` | |
| Nền trang | `bg-white`, nền khối phụ `bg-slate-50` | |
| Viền | `border border-slate-200` | |
| Bo góc | `rounded-lg` | |
| Khoảng cách trong khối | `p-4` | |
| Responsive | `md:`, `lg:` | Thiết kế cho điện thoại trước, rồi mở rộng |

### 11.2. Component nền dùng chung

Các component trong `src/components/ui/`: `Button`, `Input`, `Modal`, `ProductCard`, `Spinner`. **Cần nút hay ô nhập thì dùng lại các component này, không tự viết lại trong trang của mình.** Chưa có component nào thì nhờ người phụ trách `MainLayout` tạo trước, ví dụ:

```jsx
// src/components/ui/Button.jsx
export default function Button({ children, className = '', ...props }) {
  return (
    <button
      className={`rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
```

### 11.3. Quy tắc

- Chữ trên giao diện viết bằng **tiếng Việt**, có dấu.
- Không dùng chỉ định kích thước cố định theo điểm ảnh cho khối chính; dùng `w-full`, `max-w-*` để hiển thị tốt trên cả điện thoại.
- Mọi nút bấm phải có trạng thái `hover`; nút đang xử lý nên bị vô hiệu (`disabled`).

---

## 12. Làm việc với dữ liệu giả (khi backend chưa xong)

Trong lúc backend chưa có API thật, mỗi file trong `src/api/` trả **dữ liệu giả đúng dạng ở mục 10**. Hook và trang không cần biết dữ liệu giả hay thật.

```js
// src/api/productApi.js
const mockProducts = [
  { id: 1, name: 'Áo thun basic', price: 150000, imageUrl: '' },
  { id: 2, name: 'Hoodie', price: 350000, imageUrl: '' },
]

export const productApi = {
  getAll: () => Promise.resolve(mockProducts),
  // Khi backend xong, đổi thành:
  // getAll: () => axios.get('/api/v1/products').then((res) => res.data),
}
```

- Dữ liệu giả **phải đúng tên trường và kiểu** như mục 10. Sai tên trường thì lúc ghép với backend sẽ phải sửa trang.
- Khi backend xong API nào, **chỉ sửa file trong `src/api/`** để gọi thật, các trang giữ nguyên.
- Đổi sang API thật xong thì xóa dữ liệu giả của API đó.
