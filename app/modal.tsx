import { categoryApi } from '@/api/categoryApi'
import { noteApi } from '@/api/noteApi'
import { Colors } from '@/constants/theme'
import type { Category } from '@/types/api'
import { useLocalSearchParams, useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

export default function EditorModal() {
  const router = useRouter()
  const params = useLocalSearchParams<{
    noteId?: string
    title?: string
    content?: string
    categoryId?: string
  }>()

  const isEdit = !!params.noteId
  const [title, setTitle] = useState(params.title ?? '')
  const [content, setContent] = useState(params.content ?? '')
  const [saving, setSaving] = useState(false)
  const [userId, setUserId] = useState<number | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    params.categoryId ? Number(params.categoryId) : null,
  )

  const selectedCategory = useMemo(() => {
    if (!selectedCategoryId) return null
    return categories.find(c => c.id === selectedCategoryId) ?? null
  }, [categories, selectedCategoryId])

  useEffect(() => {
    const loadUserAndCategories = async () => {
      // 从本地读取当前登录用户
      let uid: number | null = null
      try {
        let stored: string | null = null
        if (Platform.OS === 'web') {
          stored = window.localStorage.getItem('user')
        } else {
          stored = await SecureStore.getItemAsync('user')
        }
        if (stored) {
          const parsed = JSON.parse(stored) as { id?: number }
          if (parsed.id) uid = parsed.id
        }
      } catch (e) {
        console.warn('读取用户信息失败(编辑笔记):', e)
      }

      setUserId(uid)
      if (!uid) return

      try {
        const res = await categoryApi.getUserCategories(uid)
        if (res.code === 200 && Array.isArray(res.data)) {
          setCategories(res.data)
          // 新建时如果没选择分类，默认选第一个
          if (!selectedCategoryId && res.data.length > 0) {
            setSelectedCategoryId(res.data[0].id)
          }
        }
      } catch (e) {
        console.warn('加载分类失败:', e)
      }
    }

    loadUserAndCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSave = async () => {
    const trimmedTitle = title.trim()
    const trimmedContent = content.trim()

    if (!trimmedTitle || !trimmedContent) {
      Alert.alert('提示', '标题和内容都不能为空')
      return
    }

    if (!userId) {
      Alert.alert('提示', '请先登录后再编辑或创建笔记')
      return
    }

    if (!selectedCategoryId) {
      Alert.alert('提示', '请先选择分类')
      return
    }

    try {
      setSaving(true)
      if (isEdit) {
        await noteApi.update(Number(params.noteId), {
          userId,
          categoryId: selectedCategoryId,
          title: trimmedTitle,
          content: trimmedContent,
        })
      } else {
        await noteApi.create({
          userId,
          categoryId: selectedCategoryId,
          title: trimmedTitle,
          content: trimmedContent,
        })
      }

      router.back()
    } catch (e) {
      console.warn('保存笔记失败:', e)
      Alert.alert('错误', '保存失败，请稍后重试')
    } finally {
      setSaving(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.inner}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.cancel}>取消</Text>
          </Pressable>
          <Text style={styles.titleText}>{isEdit ? '编辑笔记' : '新建笔记'}</Text>
          <Pressable onPress={handleSave} disabled={saving}>
            <Text style={styles.save}>{saving ? '保存中...' : '保存'}</Text>
          </Pressable>
        </View>

        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="输入标题"
          placeholderTextColor={Colors.light.textLight}
          style={styles.inputTitle}
        />
        {/* 分类选择 */}
        <Pressable
          style={styles.categoryRow}
          onPress={() => setShowCategoryModal(true)}
        >
          <Text style={styles.categoryLabel}>分类</Text>
          <Text style={styles.categoryValue} numberOfLines={1}>
            {selectedCategory?.name ?? '请选择分类'}
          </Text>
        </Pressable>

        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="输入内容..."
          placeholderTextColor={Colors.light.textLight}
          multiline
          style={styles.inputContent}
          textAlignVertical="top"
        />
      </View>

      {/* 分类选择弹窗 */}
      <Modal
        visible={showCategoryModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCategoryModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowCategoryModal(false)}
        />
        <View style={styles.modalSheet}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>选择分类</Text>
            <Pressable onPress={() => setShowCategoryModal(false)}>
              <Text style={styles.modalClose}>关闭</Text>
            </Pressable>
          </View>

          <FlatList
            data={categories}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => {
              const active = item.id === selectedCategoryId
              return (
                <Pressable
                  onPress={() => {
                    setSelectedCategoryId(item.id)
                    setShowCategoryModal(false)
                  }}
                  style={[
                    styles.categoryItem,
                    active && styles.categoryItemActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryItemText,
                      active && styles.categoryItemTextActive,
                    ]}
                  >
                    {item.name}
                  </Text>
                </Pressable>
              )
            }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                你还没有分类，请先去「分类管理」创建分类
              </Text>
            }
          />
        </View>
      </Modal>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inner: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cancel: {
    color: Colors.light.textLight,
    fontSize: 15,
  },
  titleText: {
    fontWeight: '600',
    fontSize: 16,
    color: Colors.light.text,
  },
  save: {
    color: Colors.light.primary,
    fontSize: 15,
    fontWeight: '500',
  },
  inputTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 12,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
    marginBottom: 12,
  },
  categoryLabel: {
    width: 48,
    fontSize: 13,
    color: Colors.light.textLight,
  },
  categoryValue: {
    flex: 1,
    fontSize: 14,
    color: Colors.light.text,
  },
  inputContent: {
    flex: 1,
    fontSize: 16,
    color: Colors.light.text,
    lineHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  modalSheet: {
    backgroundColor: '#fff',
    paddingBottom: 12,
    maxHeight: '55%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalHeader: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.text,
  },
  modalClose: {
    fontSize: 13,
    color: Colors.light.primary,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  categoryItemActive: {
    backgroundColor: '#eef3f3',
  },
  categoryItemText: {
    fontSize: 14,
    color: Colors.light.text,
  },
  categoryItemTextActive: {
    color: Colors.light.primary,
    fontWeight: '600',
  },
  emptyText: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    textAlign: 'center',
    fontSize: 13,
    color: Colors.light.textLight,
  },
})
