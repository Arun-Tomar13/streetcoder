import React, { useState, useEffect, Suspense, useMemo } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial, Ring, Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import theme from '../theme';
import Sidebar from '../components/siderbar';

// Generate random points in a sphere
function random(i) {
    const r = Math.random();
    return [
        Math.cos(r) * Math.random() * 10,
        Math.sin(r) * Math.random() * 10,
        Math.cos(r) * Math.sin(r) * 10
    ];
}

const ParticleField = () => {
    const count = 1000;
    const [positions] = useState(() => new Float32Array(random(count).flat()));

    useFrame((state) => {
        state.camera.position.z = 15 + Math.sin(state.clock.getElapsedTime() * 0.3) * 2;
    });

    return (
        <Points positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color={theme.colors.accent.mint}
                size={0.05}
                sizeAttenuation={true}
                depthWrite={false}
            />
        </Points>
    );
};

const AnimatedRing = ({ radius, rotationSpeed, color }) => {
    const meshRef = React.useRef();

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.getElapsedTime() * rotationSpeed;
            meshRef.current.rotation.y = state.clock.getElapsedTime() * (rotationSpeed * 0.5);
        }
    });

    return (
        <Ring
            ref={meshRef}
            args={[radius, radius + 0.1, 60]}
            position={[0, 0, 0]}
        >
            <meshBasicMaterial
                color={color}
                transparent
                opacity={0.5}
                side={THREE.DoubleSide}
            />
        </Ring>
    );
};

const FloatingOrb = () => {
    const meshRef = React.useRef();
    
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
        }
    });

    return (
        <mesh ref={meshRef}>
            <Sphere args={[1, 100, 200]} scale={2}>
                <MeshDistortMaterial
                    color={theme.colors.teal[500]}
                    attach="material"
                    distort={0.5}
                    speed={1.5}
                    roughness={0}
                    metalness={0.2}
                />
            </Sphere>
        </mesh>
    );
};

const WaveSphere = () => {
    const meshRef = React.useRef();
    const [positions, setPositions] = useState([]);
    const geometry = useMemo(() => {
        const geo = new THREE.IcosahedronGeometry(1.5, 20);
        return geo;
    }, []);

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (meshRef.current) {
            const position = meshRef.current.geometry.attributes.position;
            const vertex = new THREE.Vector3();
            
            for(let i = 0; i < position.count; i++) {
                vertex.fromBufferAttribute(position, i);
                const wave = 0.1 * Math.sin(vertex.x * 2 + time) * 
                            Math.sin(vertex.y * 2 + time) * 
                            Math.sin(vertex.z * 2 + time);
                vertex.normalize().multiplyScalar(1 + wave);
                position.setXYZ(i, vertex.x, vertex.y, vertex.z);
            }
            
            position.needsUpdate = true;
        }
    });

    return (
        <mesh ref={meshRef} geometry={geometry} position={[0, 0, -5]}>
            <meshPhongMaterial
                color={theme.colors.accent.pink}
                wireframe
                transparent
                opacity={0.2}
            />
        </mesh>
    );
};

const Background3D = () => {
    return (
        <div className="fixed inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 15], fov: 75 }}>
                <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    <pointLight position={[-10, -10, -10]} color={theme.colors.accent.mint} intensity={0.5} />
                    <pointLight position={[10, 10, 10]} color={theme.colors.accent.pink} intensity={0.5} />
                    
                    <FloatingOrb />
                    <WaveSphere />
                    <ParticleField />
                    
                    {/* Multiple rings with different sizes and rotation speeds */}
                    <AnimatedRing radius={3} rotationSpeed={0.3} color={theme.colors.teal[500]} />
                    <AnimatedRing radius={4} rotationSpeed={-0.2} color={theme.colors.accent.mint} />
                    <AnimatedRing radius={5} rotationSpeed={0.1} color={theme.colors.accent.pink} />
                    
                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        enableRotate={true}
                        autoRotate={true}
                        autoRotateSpeed={0.5}
                    />
                </Suspense>
            </Canvas>
        </div>
    );
};

const appId = "3c19ad919bbd498e803266952d074d56";

const QuickConnect = () => {
    const [inCall, setInCall] = useState(false);
    const [channelName, setChannelName] = useState("");
    const [users, setUsers] = useState([]);
    const [start, setStart] = useState(false);
    const [localTracks, setLocalTracks] = useState([]);
    const [client, setClient] = useState(null);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);

    useEffect(() => {
        const agoraClient = AgoraRTC.createClient({
            mode: "rtc",
            codec: "vp8"
        });
        setClient(agoraClient);
    }, []);

    const init = async (channelName) => {
        if (!client) return;

        try {
            const [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
            setLocalTracks([microphoneTrack, cameraTrack]);

            client.on("user-published", async (user, mediaType) => {
                await client.subscribe(user, mediaType);
                if (mediaType === "video") {
                    setUsers((prevUsers) => {
                        return [...prevUsers, user];
                    });
                }
                if (mediaType === "audio") {
                    user.audioTrack.play();
                }
            });

            client.on("user-unpublished", (user, mediaType) => {
                if (mediaType === "video") {
                    setUsers((prevUsers) => {
                        return prevUsers.filter((User) => User.uid !== user.uid);
                    });
                }
            });

            client.on("user-left", (user) => {
                setUsers((prevUsers) => {
                    return prevUsers.filter((User) => User.uid !== user.uid);
                });
            });

            await client.join(appId, channelName, null, null);
            await client.publish([microphoneTrack, cameraTrack]);
            setStart(true);

        } catch (error) {
            console.log("Error joining channel:", error);
            if (localTracks.length > 0) {
                localTracks.forEach(track => track.close());
            }
        }
    };

    const leaveChannel = async () => {
        if (!client) return;

        if (localTracks.length > 0) {
            localTracks.forEach(track => track.close());
        }

        await client.leave();
        client.removeAllListeners();
        setUsers([]);
        setStart(false);
        setInCall(false);
    };

    const toggleMute = () => {
        if (localTracks[0]) {
            localTracks[0].setEnabled(!isMuted);
            setIsMuted(!isMuted);
        }
    };

    const toggleVideo = () => {
        if (localTracks[1]) {
            localTracks[1].setEnabled(!isVideoOff);
            setIsVideoOff(!isVideoOff);
        }
    };

    return (
        <div className="flex h-screen bg-[#F5F5F7] font-sans">
            {/* Sidebar Component */}
            <Sidebar />
            
            {/* Main Content */}
            <div className="flex-1 ml-20 overflow-auto">
                <div className="min-h-screen relative" style={{ background: theme.gradients.pageBackground }}>
                    {/* 3D Background */}
                    <Background3D />

                    {/* Animated background elements */}
                    <div className="fixed inset-0 overflow-hidden pointer-events-none">
                        <motion.div 
                            className="absolute rounded-full" 
                            style={{ 
                                width: '500px', 
                                height: '500px', 
                                top: '-15%', 
                                left: '-10%', 
                                border: '1px solid rgba(255,255,255,0.1)',
                                filter: 'blur(0.5px)' 
                            }}
                            animate={{
                                scale: [1, 1.05, 1],
                                rotate: [0, 5, 0],
                            }}
                            transition={{
                                duration: 20,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                        <motion.div 
                            className="absolute" 
                            style={{ 
                                width: '150px', 
                                height: '150px', 
                                top: '20%', 
                                right: '15%', 
                                background: `linear-gradient(135deg, ${theme.colors.accent.pink}20, ${theme.colors.teal[500]}20)`,
                                borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
                                filter: 'blur(15px)' 
                            }}
                            animate={{
                                borderRadius: [
                                    '60% 40% 30% 70% / 60% 30% 70% 40%',
                                    '30% 60% 70% 40% / 50% 60% 30% 60%',
                                    '60% 40% 30% 70% / 60% 30% 70% 40%'
                                ],
                                rotate: [0, -15, 0],
                            }}
                            transition={{
                                duration: 10,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    </div>

                    {/* Main content */}
                    <div className="relative z-10 container mx-auto px-4 py-8">
                        {!inCall ? (
                            <motion.div 
                                className="max-w-md mx-auto"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="bg-white bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white border-opacity-20">
                                    <motion.div 
                                        className="text-center mb-8"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2, duration: 0.6 }}
                                    >
                                        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent">
                                            Quick Connect
                                        </h2>
                                        <p className="text-gray-600">Start or join a video call instantly</p>
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3, duration: 0.6 }}
                                    >
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Channel Name
                                        </label>
                                        <motion.input
                                            type="text"
                                            placeholder="Enter channel name"
                                            onChange={(e) => setChannelName(e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all duration-200"
                                            whileFocus={{ scale: 1.01 }}
                                            whileHover={{ y: -2 }}
                                        />
                                    </motion.div>

                                    <motion.button
                                        onClick={() => {
                                            setInCall(true);
                                            init(channelName);
                                        }}
                                        className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-teal-500 to-blue-500 text-white font-medium rounded-lg focus:outline-none transition duration-200 relative overflow-hidden group"
                                        whileHover={{ scale: 1.02, boxShadow: theme.shadows.button }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <motion.span 
                                            className="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-20"
                                            initial={{ x: '-100%' }}
                                            whileHover={{ x: '100%' }}
                                            transition={{ duration: 0.5 }}
                                        />
                                        Join Call
                                    </motion.button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="h-[90vh] relative">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                                    {localTracks.length > 0 && (
                                        <motion.div 
                                            className="relative rounded-2xl overflow-hidden shadow-lg bg-black"
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            <video
                                                className="w-full h-full object-cover"
                                                ref={(ref) => {
                                                    if (ref && localTracks[1]) {
                                                        localTracks[1].play(ref);
                                                    }
                                                }}
                                            />
                                            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded-lg">
                                                <p className="text-white text-sm">You</p>
                                            </div>
                                        </motion.div>
                                    )}
                                    
                                    {users.map((user) => (
                                        user.videoTrack && (
                                            <motion.div 
                                                key={user.uid}
                                                className="relative rounded-2xl overflow-hidden shadow-lg bg-black"
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ duration: 0.5 }}
                                            >
                                                <video
                                                    className="w-full h-full object-cover"
                                                    ref={(ref) => {
                                                        if (ref) {
                                                            user.videoTrack.play(ref);
                                                        }
                                                    }}
                                                />
                                                <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded-lg">
                                                    <p className="text-white text-sm">Remote User</p>
                                                </div>
                                            </motion.div>
                                        )
                                    ))}
                                </div>

                                {/* Control buttons */}
                                <motion.div 
                                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5, duration: 0.5 }}
                                >
                                    <motion.button
                                        onClick={toggleMute}
                                        className={`p-4 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-800'} text-white shadow-lg`}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            {isMuted ? (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                            ) : (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                            )}
                                        </svg>
                                    </motion.button>

                                    <motion.button
                                        onClick={toggleVideo}
                                        className={`p-4 rounded-full ${isVideoOff ? 'bg-red-500' : 'bg-gray-800'} text-white shadow-lg`}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            {isVideoOff ? (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            ) : (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            )}
                                        </svg>
                                    </motion.button>

                                    <motion.button
                                        onClick={leaveChannel}
                                        className="p-4 rounded-full bg-red-500 text-white shadow-lg"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                    </motion.button>
                                </motion.div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuickConnect;
