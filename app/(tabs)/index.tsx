import { Colors } from '@/constants/theme'
import { Redirect, useFocusEffect, useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, FlatList, Platform, StyleSheet, View } from 'react-native'

import { categoryApi } from '@/api/categoryApi'
import { noteApi } from '@/api/noteApi'
import CalendarPanel from '@/components/CalendarPanel'
import CategoryBar, { type CategoryBarItem } from '@/components/CategoryBar'
import FabButton from '@/components/FabButton'
import Header from '@/components/Header'
import NoteCard from '@/components/NoteCard'
import type { Category, Note, User } from '@/types/api'

export default function HomeScreen() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [checkingUser, setCheckingUser] = useState(true)

  const [categories, setCategories] = useState<Category[]>([])
  const [activeCategoryId, setActiveCategoryId] =
    useState<CategoryBarItem['id']>('all')
  const [showCalendar, setShowCalendar] = useState(false)
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [keyword, setKeyword] = useState('')

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
            // 某些环境（尤其是 Web 或未正确安装原生模块）SecureStore 可能不可用
            console.warn('读取本地登录信息失败，忽略并视为未登录:', e)
            stored = null
          }
        }
        if (stored) {
          const parsed: User = JSON.parse(stored)
          setUser(parsed)
        }
      } finally {
        setCheckingUser(false)
      }
    }

    loadUser()
  }, [])

  const categoryItems: CategoryBarItem[] = useMemo(() => {
    return [
      { id: 'all', name: '全部' },
      ...categories.map(c => ({ id: c.id, name: c.name })),
    ]
  }, [categories])

  const loadCategories = async (userId: number) => {
    const res = await categoryApi.getUserCategories(userId)
    if (res?.code === 200) setCategories(res.data ?? [])
  }

  const loadNotes = async (categoryId: CategoryBarItem['id'], userId: number) => {
    setLoading(true)
    try {
      const res =
        categoryId === 'all'
          ? await noteApi.getUserNotes(userId)
          : await noteApi.getNotesByCategory(categoryId as number, userId)
      if (res?.code === 200) setNotes(res.data ?? [])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user) return
    loadCategories(user.id)
    loadNotes('all', user.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  // 从编辑/新建笔记页返回时，自动刷新当前条件下的笔记列表
  useFocusEffect(
    useCallback(() => {
      if (!user) return

      const refresh = async () => {
        await loadCategories(user.id)

        // 有搜索关键词时，按关键词刷新
        if (keyword.trim()) {
          setLoading(true)
          try {
            const res = await noteApi.search(user.id, keyword.trim())
            if (res?.code === 200) {
              setNotes(res.data ?? [])
            }
          } finally {
            setLoading(false)
          }
          return
        }

        // 没有搜索关键词时，按当前分类刷新
        await loadNotes(activeCategoryId, user.id)
      }

      refresh()
    }, [user, activeCategoryId, keyword]),
  )

  if (checkingUser) {
    return null
  }

  if (!user) {
    return <Redirect href="/auth" />
  }

  const handleChangeKeyword = async (value: string) => {
    setKeyword(value)
    if (!user) return

    // 没有输入内容时，展示全部笔记
    if (!value.trim()) {
      await loadNotes('all', user.id)
      return
    }

    // 有搜索词时，使用搜索接口替换 notes
    setLoading(true)
    try {
      const res = await noteApi.search(user.id, value.trim())
      if (res?.code === 200) {
        setNotes(res.data ?? [])
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      {/* 顶部 Header */}
      <Header
        onCalendar={() => {
          // console.log('日历按钮被点击，当前状态:', showCalendar)
          setShowCalendar(v => !v)
        }}
        keyword={keyword}
        onChangeKeyword={handleChangeKeyword}
        isCalendarOpen={showCalendar}
      />

      {/* 日历面板 */}
      {showCalendar && <CalendarPanel userId={user.id} />}

      {/* 分类栏 */}
      <CategoryBar
        items={categoryItems}
        activeId={activeCategoryId}
        onChange={id => {
          setActiveCategoryId(id)
          loadNotes(id, user.id)
        }}
      />

      {/* 笔记列表 */}
      {loading && notes.length === 0 ? (
        <View style={styles.loadingWrapper}>
          <ActivityIndicator color={Colors.light.primary} />
        </View>
      ) : (
        <FlatList
          data={notes}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <NoteCard
              note={item}
              onPress={() =>
                router.push({
                  pathname: '/modal' as any,
                  params: {
                    noteId: String(item.id),
                    title: item.title,
                    content: item.content,
                    categoryId: String(item.categoryId),
                  },
                })
              }
            />
          )}
          refreshing={refreshing}
          onRefresh={async () => {
            setRefreshing(true)
            try {
              await Promise.all([
                loadCategories(user.id),
                loadNotes(activeCategoryId, user.id),
              ])
            } finally {
              setRefreshing(false)
            }
          }}
        />
      )}

      {/* 悬浮新增按钮 */}
      <FabButton />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  list: {
    padding: 16,
    paddingBottom: 100, // 给 FAB 留空间，避免挡住最后一条
  },
  loadingWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
