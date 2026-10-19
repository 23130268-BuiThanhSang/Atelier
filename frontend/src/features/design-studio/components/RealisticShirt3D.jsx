import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { DecalGeometry } from 'three-stdlib';
import { useDesignStore } from '../store/designStore';

useGLTF.preload('/models/t_shirt.glb');

function urlFormatValid(url) {
    return Boolean(url && typeof url === 'string' && url.startsWith('data:image'));
}

function useCanvasTexture(dataUrl) {
    const [texture, setTexture] = useState(null);

    useEffect(() => {
        if (!urlFormatValid(dataUrl)) {
            setTexture(null);
            return;
        }

        let isMounted = true;
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            if (!isMounted) return;
            const tex = new THREE.Texture(img);
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.anisotropy = 16;
            tex.wrapS = THREE.ClampToEdgeWrapping;
            tex.wrapT = THREE.ClampToEdgeWrapping;
            tex.flipY = true;
            tex.needsUpdate = true;
            setTexture(tex);
        };
        img.src = dataUrl;

        return () => {
            isMounted = false;
        };
    }, [dataUrl]);

    return texture;
}

// Hàm lọc chỉ giữ lại các tam giác quay mặt về phía máy chiếu (Trước hoặc Sau)
// và đẩy nhẹ 1.5mm dọc theo pháp tuyến để không bao giờ bị vải áo che khuất
function buildCleanSideDecal(rawDecalGeom, isBack) {
    const pos = rawDecalGeom.attributes.position;
    const norm = rawDecalGeom.attributes.normal;
    const uv = rawDecalGeom.attributes.uv;

    if (!pos || pos.count === 0 || !norm || !uv) return null;

    const positions = [];
    const normals = [];
    const uvs = [];

    // Hướng chiếu: Mặt trước nhìn về +Z (1), Mặt sau nhìn về -Z (-1)
    const targetDirZ = isBack ? -1 : 1;
    // Đẩy nhẹ lớp in nổi lên khỏi bề mặt vải 1.5mm
    const surfaceOffset = 0.0015;

    for (let i = 0; i < pos.count; i += 3) {
        // Tính vector pháp tuyến hình học thực tế của tam giác trong không gian chuẩn
        const ax = pos.getX(i), ay = pos.getY(i), az = pos.getZ(i);
        const bx = pos.getX(i + 1), by = pos.getY(i + 1), bz = pos.getZ(i + 1);
        const cx = pos.getX(i + 2), cy = pos.getY(i + 2), cz = pos.getZ(i + 2);

        // Tích có hướng (B - A) x (C - A) để lấy thành phần Z của pháp tuyến mặt
        const abx = bx - ax, aby = by - ay, abz = bz - az;
        const acx = cx - ax, acy = cy - ay, acz = cz - az;
        const faceNormalZ = abx * acy - aby * acx;
        const avgZ = (az + bz + cz) / 3;

        // Điều kiện kép: Tam giác phải nằm ở nửa áo tương ứng VÀ hướng mặt ra ngoài
        const isCorrectHalf = isBack ? avgZ < 0.02 : avgZ > -0.02;
        const isFacingProjector = faceNormalZ * targetDirZ >= -0.00001;

        if (isCorrectHalf && isFacingProjector) {
            for (let j = 0; j < 3; j++) {
                const idx = i + j;
                const vx = pos.getX(idx);
                const vy = pos.getY(idx);
                const vz = pos.getZ(idx);

                const nx = norm.getX(idx);
                const ny = norm.getY(idx);
                const nz = norm.getZ(idx);

                positions.push(
                    vx + nx * 0.0005,
                    vy + ny * 0.0005,
                    vz + targetDirZ * surfaceOffset
                );
                normals.push(nx, ny, nz);
                uvs.push(uv.getX(idx), uv.getY(idx));
            }
        }
    }

    if (positions.length === 0) return null;

    const cleanGeom = new THREE.BufferGeometry();
    cleanGeom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    cleanGeom.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    cleanGeom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    return cleanGeom;
}

// COMPONENT QUÉT DECAL TRÊN TOÀN BỘ 4 MẢNH GHÉP CỦA ÁO (OBJECT_4, 5, 6, 7)
function ShirtDecalLayer({ staticMeshes, texture, isBack = false }) {
    const decalGeometries = useMemo(() => {
        if (!texture || !staticMeshes || staticMeshes.length === 0) return [];

        // Đặt tâm hộp chiếu ở mặt ngoài ngực (0.14) hoặc lưng (-0.14)
        const position = new THREE.Vector3(0, -0.02, isBack ? -0.14 : 0.14);
        const orientation = new THREE.Euler(0, isBack ? Math.PI : 0, 0);

        // Độ sâu 0.28 đủ chạm sâu vào vùng lõm của lưng trên nhưng không xuyên sang mặt đối diện
        const size = new THREE.Vector3(0.40, 0.533, 0.28);

        const validGeoms = [];

        // Duyệt qua TẤT CẢ các mảnh ghép (Object_4, 5, 6, 7) để lấp kín 2 vạch ngang và phần lưng trên
        staticMeshes.forEach((mesh) => {
            try {
                const rawGeom = new DecalGeometry(mesh, position, orientation, size);
                const cleanGeom = buildCleanSideDecal(rawGeom, isBack);
                rawGeom.dispose();

                if (cleanGeom) {
                    validGeoms.push(cleanGeom);
                }
            } catch (err) {
                console.warn('Lỗi tạo Decal trên mảnh mesh:', err);
            }
        });

        return validGeoms;
    }, [staticMeshes, texture, isBack]);

    useEffect(() => {
        return () => {
            decalGeometries.forEach((g) => g.dispose());
        };
    }, [decalGeometries]);

    if (!texture || decalGeometries.length === 0) return null;

    return (
        <group>
            {decalGeometries.map((geom, index) => (
                <mesh key={index} geometry={geom} renderOrder={10}>
                    <meshStandardMaterial
                        map={texture}
                        transparent={true}
                        alphaTest={0.01}
                        roughness={1.0}
                        metalness={0.0}
                        envMapIntensity={0.2}
                        polygonOffset={true}
                        polygonOffsetFactor={-10}
                        polygonOffsetUnits={-10}
                        depthTest={true}
                        depthWrite={false}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            ))}
        </group>
    );
}

function ShirtModel({ garmentColor, frontTextureUrl, backTextureUrl }) {
    const gltf = useGLTF('/models/t_shirt.glb');
    const frontTex = useCanvasTexture(frontTextureUrl);
    const backTex = useCanvasTexture(backTextureUrl);

    const { displayScene, displayMeshes, staticColliderMeshes } = useMemo(() => {
        if (!gltf?.scene) return { displayScene: null, displayMeshes: [], staticColliderMeshes: [] };

        const createNormalizedWrapper = () => {
            const clone = gltf.scene.clone(true);
            clone.updateMatrixWorld(true);

            const box = new THREE.Box3().setFromObject(clone);
            const center = new THREE.Vector3();
            const size = new THREE.Vector3();
            box.getCenter(center);
            box.getSize(size);

            const maxDim = Math.max(size.x, size.y, size.z) || 1;
            const targetScale = 1.15 / maxDim;

            const wrapper = new THREE.Group();
            clone.position.set(-center.x * targetScale, -center.y * targetScale, -center.z * targetScale);
            clone.scale.setScalar(targetScale);
            wrapper.add(clone);
            wrapper.updateMatrixWorld(true);
            return wrapper;
        };

        // 1. Scene hiển thị trực quan trên màn hình
        const visualWrapper = createNormalizedWrapper();
        const visualMeshList = [];

        visualWrapper.traverse((child) => {
            if (child.isMesh && child.geometry) {
                child.material = child.material.clone();
                child.castShadow = false;
                child.receiveShadow = false;
                child.geometry.computeVertexNormals();
                visualMeshList.push(child);
            }
        });

        // 2. Bộ khung tĩnh chứa TOÀN BỘ 4 mảnh (Object_4, Object_5, Object_6, Object_7)
        // Đứng độc lập với góc xoay của camera để tính toán DecalGeometry chính xác tuyệt đối
        const staticWrapper = createNormalizedWrapper();
        const colliderList = [];

        staticWrapper.traverse((child) => {
            if (child.isMesh && child.geometry) {
                child.geometry.computeVertexNormals();
                child.updateMatrixWorld(true);
                colliderList.push(child);
            }
        });

        return {
            displayScene: visualWrapper,
            displayMeshes: visualMeshList,
            staticColliderMeshes: colliderList
        };
    }, [gltf]);

    useEffect(() => {
        if (!displayMeshes.length) return;
        const colorObj = new THREE.Color(garmentColor || '#F5F2DC');

        displayMeshes.forEach((mesh) => {
            if (mesh.material) {
                mesh.material.color.set(colorObj);
                mesh.material.roughness = 1.0;
                mesh.material.metalness = 0.0;
                mesh.material.envMapIntensity = 0.25;
                mesh.material.needsUpdate = true;
            }
        });
    }, [displayMeshes, garmentColor]);

    if (!displayScene) return null;

    return (
        <group position={[0, 0, 0]}>
            <primitive object={displayScene} />

            {/* In Mặt Trước (ghép liền mạch trên cả 4 mảnh Mesh) */}
            {frontTex && (
                <ShirtDecalLayer
                    staticMeshes={staticColliderMeshes}
                    texture={frontTex}
                    isBack={false}
                />
            )}

            {/* In Mặt Sau (ghép liền mạch trên cả 4 mảnh Mesh) */}
            {backTex && (
                <ShirtDecalLayer
                    staticMeshes={staticColliderMeshes}
                    texture={backTex}
                    isBack={true}
                />
            )}
        </group>
    );
}

export default function RealisticShirt3D({ rotationAngle = 0 }) {
    const groupRef = useRef();
    const { garmentColor, frontTextureUrl, backTextureUrl } = useDesignStore();

    useFrame((_, delta) => {
        if (!groupRef.current) return;
        const targetRad = (rotationAngle * Math.PI) / 180;
        groupRef.current.rotation.y = THREE.MathUtils.damp(
            groupRef.current.rotation.y,
            targetRad,
            6,
            delta
        );
    });

    return (
        <group ref={groupRef}>
            <ShirtModel
                garmentColor={garmentColor}
                frontTextureUrl={frontTextureUrl}
                backTextureUrl={backTextureUrl}
            />
        </group>
    );
}