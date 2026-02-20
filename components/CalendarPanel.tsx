import { useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import { Calendar, LocaleConfig } from 'react-native-calendars'

import { noteApi } from '@/api/noteApi'
import { Colors } from '@/constants/theme'
import type { Note } from '@/types/api'

// 中文
LocaleConfig.locales['zh'] = {
    monthNames: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
    monthNamesShort: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
    dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
    dayNamesShort: ['日','一','二','三','四','五','六'],
    today: '今天',
}
LocaleConfig.defaultLocale = 'zh'

export default function CalendarPanel({ userId }: { userId: number }) {
    const [selectedDate, setSelectedDate] = useState(
        new Date().toISOString().slice(0, 10),
    )
    const [notes, setNotes] = useState<Note[]>([])
    const [loading, setLoading] = useState(false)
    const [activeDates, setActiveDates] = useState<string[]>([])
    const [currentYearMonth, setCurrentYearMonth] = useState(
        new Date().toISOString().slice(0, 7),
    )

    // 加载某一天笔记
    const loadNotesByDate = async (date: string) => {
        setLoading(true)
        try {
            const res = await noteApi.getNotesByDate(userId, date)
            if (res.code === 200 && Array.isArray(res.data)) {
                setNotes(res.data)
            } else {
                setNotes([])
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadNotesByDate(selectedDate)
    }, [selectedDate, userId])

    // 加载某月有笔记的日期
    const loadActiveDays = async (yearMonth: string) => {
        try {
            const res = await noteApi.getActiveDays(userId, yearMonth)
            if (res.code === 200 && Array.isArray(res.data)) {
                setActiveDates(res.data)
            } else {
                setActiveDates([])
            }
        } catch {
            setActiveDates([])
        }
    }

    useEffect(() => {
        loadActiveDays(currentYearMonth)
    }, [currentYearMonth, userId])

    // 标记日期
    const marked = useMemo(() => {
        const map: Record<string, any> = {}

        activeDates.forEach(d => {
            map[d] = {
                marked: true,
                dotColor: Colors.light.primary,
            }
        })

        map[selectedDate] = {
            ...(map[selectedDate] || {}),
            selected: true,
            selectedColor: Colors.light.primary,
            selectedTextColor: '#fff',
        }

        return map
    }, [activeDates, selectedDate])

    return (
        <View style={styles.wrapper}>
            {/* 日历 */}
            <Calendar
                current={selectedDate}
                markedDates={marked}
                firstDay={1}
                onDayPress={day => {
                    setSelectedDate(day.dateString)
                }}
                onMonthChange={month => {
                    setCurrentYearMonth(month.dateString.slice(0, 7))
                }}
                theme={{
                    todayTextColor: Colors.light.primary,
                    selectedDayBackgroundColor: Colors.light.primary,
                    selectedDayTextColor: '#fff',
                    arrowColor: Colors.light.primary,
                    monthTextColor: Colors.light.text,
                    textSectionTitleColor: Colors.light.textLight,
                }}
            />

            {/* 列表标题 */}
            <View style={styles.listHeader}>
                <Text style={styles.listTitle}>
                    {selectedDate} 的笔记（{notes.length}）
                </Text>
            </View>

            {/* 内容 */}
            {loading ? (
                <View style={styles.loading}>
                    <ActivityIndicator color={Colors.light.primary} />
                </View>
            ) : (
                <FlatList
                    data={notes}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.noteList}
                    renderItem={({ item }) => (
                        <View style={styles.noteItem}>
                            <Text style={styles.noteTitle} numberOfLines={1}>
                                {item.title}
                            </Text>
                            <Text style={styles.noteContent} numberOfLines={2}>
                                {item.content}
                            </Text>
                        </View>
                    )}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>这一天还没有记录~</Text>
                    }
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: '#fff',
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 3,
        marginBottom: 8,
    },
    listHeader: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 4,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#f0f0f0',
    },
    listTitle: {
        fontSize: 13,
        color: Colors.light.textLight,
    },
    loading: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    noteList: {
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    noteItem: {
        paddingVertical: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#f2f2f2',
    },
    noteTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.light.text,
        marginBottom: 4,
    },
    noteContent: {
        fontSize: 13,
        color: Colors.light.textLight,
    },
    emptyText: {
        paddingVertical: 16,
        textAlign: 'center',
        fontSize: 13,
        color: Colors.light.textLight,
    },
})
