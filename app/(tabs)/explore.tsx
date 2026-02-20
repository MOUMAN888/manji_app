import { categoryApi } from '@/api/categoryApi'
import { noteApi } from '@/api/noteApi'
import { userApi } from '@/api/userApi'
import { Colors } from '@/constants/theme'
import type { User } from '@/types/api'
import { Ionicons } from '@expo/vector-icons'
import { useFocusEffect, useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { useCallback, useEffect, useState } from 'react'
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native'

export default function ProfileScreen() {
    const router = useRouter()

    const [user, setUser] = useState<User | null>(null)
    const [categoryCount, setCategoryCount] = useState(0)
    const [wordCount, setWordCount] = useState(0)
    const [noteCount, setNoteCount] = useState(0)
    const [loadingStats, setLoadingStats] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editUsername, setEditUsername] = useState('')
    const [editIntro, setEditIntro] = useState('')
    const [updating, setUpdating] = useState(false)

    useEffect(() => {
        const loadUser = async () => {
            try {
                let stored: string | null = null
                if (Platform.OS === 'web') {
                    stored = window.localStorage.getItem('user')
                } else {
                    try {
                        stored = await SecureStore.getItemAsync('user')
                    } catch (e) {
                        // console.warn('读取本地用户信息失败(个人页)，视为未登录:', e)
                        stored = null
                    }
                }
                if (stored) {
                    const parsed: User = JSON.parse(stored)
                    setUser(parsed)
                }
            } catch (e) {
                // console.warn('解析本地用户信息失败(个人页):', e)
            }
        }

        loadUser()
    }, [])

    const fetchStats = useCallback(async () => {
        if (!user) return

        try {
            setLoadingStats(true)
            const [catRes] = await Promise.all([
                categoryApi.getUserCategories(user.id),
            ])

            if (catRes.code === 200 && Array.isArray(catRes.data)) {
                setCategoryCount(catRes.data.length)
            }
        } finally {
            setLoadingStats(false)
        }
    }, [user])

    useEffect(() => {
        fetchStats()
    }, [fetchStats])

    // 从分类管理页返回时，自动刷新统计数据
    useFocusEffect(
        useCallback(() => {
            fetchStats()
        }, [fetchStats]),
    )

    const formatNumber = (num: number) =>
        num > 9999 ? `${(num / 10000).toFixed(1)} 万` : `${num}`

    const handleEditPress = () => {
        if (!user) return
        setEditUsername(user.username)
        setEditIntro(user.intro || '')
        setShowEditModal(true)
    }

    const handleSaveEdit = async () => {
        if (!user) return

        const username = editUsername.trim()
        const intro = editIntro.trim()

        if (!username && !intro) {
            Alert.alert('提示', '用户名和个性签名至少需要填写一个')
            return
        }

        try {
            setUpdating(true)
            const params: { username?: string; intro?: string } = {}
            if (username) params.username = username
            if (intro) params.intro = intro

            const res = await userApi.update(user.id, params)
            if (res.code === 200 && res.data) {
                const updatedUser = res.data
                setUser(updatedUser)

                const userJson = JSON.stringify(updatedUser)
                if (Platform.OS === 'web') {
                    window.localStorage.setItem('user', userJson)
                } else {
                    try {
                        await SecureStore.setItemAsync('user', userJson)
                    } catch (e) {
                        console.warn('保存用户信息到本地失败:', e)
                    }
                }

                setShowEditModal(false)
                Alert.alert('成功', '个人信息已更新')
            }
        } catch (e) {
            Alert.alert('错误', '更新失败，请稍后重试')
        } finally {
            setUpdating(false)
        }
    }

    const handleLogout = () => {
        Alert.alert('退出登录', '确定要退出当前账号吗？', [
            { text: '取消', style: 'cancel' },
            {
                text: '退出',
                style: 'destructive',
                onPress: async () => {
                    try {
                        if (Platform.OS === 'web') {
                            window.localStorage.removeItem('user')
                        } else {
                            try {
                                await SecureStore.deleteItemAsync('user')
                            } catch (e) {
                                console.warn('清除本地登录信息失败:', e)
                            }
                        }
                    } finally {
                        setUser(null)
                        router.replace('/auth' as any)
                    }
                },
            },
        ])
    }

    return (
        <View style={styles.container}>
            {/* 顶部个人信息 */}
            <View style={styles.profileHeader}>
                <View style={styles.avatarWrapper}>
                    <View style={styles.avatar}>
                        <Ionicons name="person" size={32} color="#fff" />
                    </View>
                    <Pressable
                        style={styles.editBadge}
                        onPress={handleEditPress}
                    >
                        <Ionicons name="pencil" size={12} color="#fff" />
                    </Pressable>
                </View>

                <Text style={styles.username}>{user?.username ?? '未登录用户'}</Text>
                <Text style={styles.bio}>
                    {user?.intro && user.intro.length > 0
                        ? user.intro
                        : ''}
                </Text>
            </View>

            {/* 统计卡片 */}
            <View style={styles.statsCard}>
                <Stat
                    value={loadingStats ? '—' : `${categoryCount}`}
                    label="分类数量"
                />
                <Divider />
                <Stat
                    value={loadingStats ? '—' : formatNumber(wordCount)}
                    label="累计字数"
                />
                <Divider />
                <Stat
                    value={loadingStats ? '—' : `${noteCount}`}
                    label="笔记数量"
                />
            </View>

            {/* 菜单组一 */}
            <View style={styles.menuGroup}>
                <MenuItem
                    icon="layers-outline"
                    label="分类管理"
                    onPress={() => router.push('/categories' as any)}
                />
                <MenuItem
                    icon="log-out-outline"
                    label="退出登录"
                    onPress={handleLogout}
                />
            </View>

            {/* 菜单组二 */}
            {/* <View style={styles.menuGroup}>
                <MenuItem
                    icon="settings-outline"
                    label="设置"
                />
            </View> */}

            {/* 编辑用户信息弹窗 */}
            <Modal
                visible={showEditModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowEditModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        style={styles.modalContentWrapper}
                    >
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>编辑个人信息</Text>

                            <View style={styles.modalForm}>
                                <Text style={styles.modalLabel}>用户名</Text>
                                <TextInput
                                    value={editUsername}
                                    onChangeText={setEditUsername}
                                    placeholder="请输入用户名"
                                    placeholderTextColor={Colors.light.textLight}
                                    style={styles.modalInput}
                                    autoCapitalize="none"
                                />

                                <Text style={styles.modalLabel}>个性签名</Text>
                                <TextInput
                                    value={editIntro}
                                    onChangeText={setEditIntro}
                                    placeholder="写点什么来介绍自己吧"
                                    placeholderTextColor={Colors.light.textLight}
                                    style={[styles.modalInput, styles.modalTextarea]}
                                    multiline
                                    numberOfLines={3}
                                    textAlignVertical="top"
                                />
                            </View>

                            <View style={styles.modalButtons}>
                                <Pressable
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setShowEditModal(false)}
                                    disabled={updating}
                                >
                                    <Text style={styles.cancelButtonText}>取消</Text>
                                </Pressable>
                                <Pressable
                                    style={[
                                        styles.modalButton,
                                        styles.saveButton,
                                        updating && { opacity: 0.6 },
                                    ]}
                                    onPress={handleSaveEdit}
                                    disabled={updating}
                                >
                                    <Text style={styles.saveButtonText}>
                                        {updating ? '保存中...' : '保存'}
                                    </Text>
                                </Pressable>
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>
        </View>
    )
}

/* -------- 子组件 -------- */

function Stat({ value, label }: { value: string; label: string }) {
    return (
        <View style={styles.statItem}>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    )
}

function Divider() {
    return <View style={styles.divider} />
}

function MenuItem({
    icon,
    label,
    onPress,
}: {
    icon: keyof typeof Ionicons.glyphMap
    label: string
    onPress?: () => void
}) {
    return (
        <Pressable style={styles.menuItem} onPress={onPress}>
            <Ionicons name={icon} size={20} color={Colors.light.primary} />
            <Text style={styles.menuText}>{label}</Text>
            <Ionicons name="chevron-forward" size={14} color="#ccc" />
        </Pressable>
    )
}

/* -------- 样式 -------- */

const PRIMARY = Colors.light.primary

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8faf9',
    },

    /* Header */
    profileHeader: {
        paddingTop: 36,
        paddingBottom: 60,
        alignItems: 'center',
        backgroundColor: '#fff',
    },

    avatarWrapper: {
        position: 'relative',
        marginBottom: 14,
    },

    avatar: {
        width: 86,
        height: 86,
        borderRadius: 43,
        backgroundColor: PRIMARY,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#fff',
        shadowColor: PRIMARY,
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },

    editBadge: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: '#4f6e70',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },

    username: {
        fontSize: 20,
        fontWeight: '600',
        color: '#2c3e50',
    },

    bio: {
        marginTop: 6,
        fontSize: 13,
        color: '#95a5a6',
    },

    /* Stats */
    statsCard: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginTop: -30,
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingVertical: 18,
        justifyContent: 'space-around',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 15,
    },

    statItem: {
        alignItems: 'center',
    },

    statValue: {
        fontSize: 20,
        fontWeight: '700',
        color: PRIMARY,
    },

    statLabel: {
        marginTop: 4,
        fontSize: 12,
        color: '#95a5a6',
    },

    divider: {
        width: 1,
        backgroundColor: '#eee',
    },

    /* Menu */
    menuGroup: {
        marginHorizontal: 20,
        marginTop: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 10,
    },

    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#f2f2f2',
    },

    menuText: {
        flex: 1,
        marginLeft: 14,
        fontSize: 14,
        color: '#2c3e50',
    },

    /* Modal */
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },

    modalContentWrapper: {
        width: '100%',
        maxWidth: 400,
    },

    modalContent: {
        backgroundColor: Colors.light.card,
        borderRadius: 20,
        padding: 24,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 10 },
        elevation: 5,
    },

    modalTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 20,
        textAlign: 'center',
    },

    modalForm: {
        marginBottom: 20,
    },

    modalLabel: {
        fontSize: 13,
        color: Colors.light.textLight,
        marginBottom: 6,
        marginTop: 12,
    },

    modalInput: {
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e4e3',
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 14,
        color: Colors.light.text,
        backgroundColor: '#fdfefe',
    },

    modalTextarea: {
        minHeight: 80,
    },

    modalButtons: {
        flexDirection: 'row',
        gap: 12,
    },

    modalButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },

    cancelButton: {
        backgroundColor: '#f0f0f0',
    },

    cancelButtonText: {
        fontSize: 14,
        color: Colors.light.text,
        fontWeight: '500',
    },

    saveButton: {
        backgroundColor: Colors.light.primary,
    },

    saveButtonText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '600',
    },
})
