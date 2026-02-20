import { categoryApi } from '@/api/categoryApi'
import { Colors } from '@/constants/theme'
import type { Category, User } from '@/types/api'
import * as SecureStore from 'expo-secure-store'
import { useEffect, useState } from 'react'
import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native'

export default function CategoriesScreen() {
  const [user, setUser] = useState<User | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [newName, setNewName] = useState('')

  useEffect(() => {
    const loadUser = async () => {
      try {
        let stored: string | null = null
        if (Platform.OS === 'web') {
          stored = window.localStorage.getItem('user')
        } else {
          try {
            stored = await SecureStore.getItemAsync('user')
          } catch {
            stored = null
          }
        }
        if (stored) {
          const parsed: User = JSON.parse(stored)
          setUser(parsed)
        }
      } catch {
        // ignore
      }
    }
    loadUser()
  }, [])

  const loadCategories = async (userId: number) => {
    setLoading(true)
    try {
      const res = await categoryApi.getUserCategories(userId)
      if (res.code === 200 && Array.isArray(res.data)) {
        setCategories(res.data)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user) return
    loadCategories(user.id)
  }, [user])

  const handleAdd = async () => {
    if (!user) return
    const name = newName.trim()
    if (!name) return
    try {
      setLoading(true)
      const res = await categoryApi.create({ userId: user.id, name })
      if (res.code === 200 && res.data) {
        setNewName('')
        loadCategories(user.id)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (category: Category) => {
    if (!user) return
    Alert.alert(
      '删除分类',
      `确定要删除分类「${category.name}」吗？\n（其下笔记会一并删除）`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true)
              const res = await categoryApi.delete(category.id)
              if (res.code === 200) {
                loadCategories(user.id)
              }
            } finally {
              setLoading(false)
            }
          },
        },
      ],
    )
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.card}>
        {/* 新增分类输入 */}
        <View style={styles.addRow}>
          <TextInput
            value={newName}
            onChangeText={setNewName}
            placeholder="输入新的分类名称"
            placeholderTextColor={Colors.light.textLight}
            style={styles.input}
          />
          <Pressable
            style={({ pressed }) => [
              styles.addButton,
              pressed && { opacity: 0.85 },
              (!newName.trim() || !user) && { opacity: 0.5 },
            ]}
            disabled={!newName.trim() || !user || loading}
            onPress={handleAdd}
          >
            <Text style={styles.addButtonText}>添加</Text>
          </Pressable>
        </View>

        {/* 分类列表 */}
        <FlatList
          data={categories}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.itemRow}>
              <View>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemMeta}>
                  创建时间：{new Date(item.createTime).toLocaleDateString()}
                </Text>
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.deleteButton,
                  pressed && { opacity: 0.8 },
                ]}
                onPress={() => handleDelete(item)}
              >
                <Text style={styles.deleteText}>删除</Text>
              </Pressable>
            </View>
          )}
        />
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 16,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.light.card,
    borderRadius: 20,
    padding: 16,
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e4e3',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: Colors.light.text,
    backgroundColor: '#fdfefe',
  },
  addButton: {
    marginLeft: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: Colors.light.primary,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  list: {
    paddingTop: 4,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.light.text,
  },
  itemMeta: {
    marginTop: 4,
    fontSize: 11,
    color: Colors.light.textLight,
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#f5b7b1',
    backgroundColor: '#fdecea',
  },
  deleteText: {
    fontSize: 12,
    color: '#e74c3c',
  },
})

