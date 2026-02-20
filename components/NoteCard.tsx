import { Colors } from '@/constants/theme'
import type { Note } from '@/types/api'
import { Ionicons } from '@expo/vector-icons'
import { useRef } from 'react'
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native'

function formatDate(iso: string) {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
}

export default function NoteCard({
    note,
    onPress,
    onDelete,
}: {
    note: Note
    onPress?: () => void
    onDelete?: () => void
}) {
    const categoryLabel = note.categoryName ?? `分类#${note.categoryId}`
    const ignoreNextPressRef = useRef(false)

    return (
        <Pressable
            onPress={() => {
                if (ignoreNextPressRef.current) return
                onPress?.()
            }}
            style={({ pressed }) => [
                styles.card,
                pressed && onPress ? { opacity: 0.92 } : null,
            ]}
        >
            <View style={styles.headerRow}>
                <View style={styles.headerLeft}>
                    <Text style={styles.tag} numberOfLines={1}>
                        {categoryLabel}
                    </Text>
                    <Text style={styles.title} numberOfLines={1}>
                        {note.title}
                    </Text>
                </View>
                <Text style={styles.date}>{formatDate(note.createTime)}</Text>
            </View>

            <Text style={styles.content}>{note.content}</Text>

            <View style={styles.footerRow}>
                <Text style={styles.words}>{note.wordCount} 字</Text>
                <Pressable
                    hitSlop={10}
                    onPress={e => {
                        e.stopPropagation();
                        console.log('删除笔记')
                        Alert.alert('删除笔记', '确定要删除该笔记吗？', [
                            { text: '取消', style: 'cancel' },
                            {
                                text: '删除', style: 'destructive', onPress: () => {
                                    onDelete?.()
                                }
                            },
                        ])
                    }
                    }>
                    <Ionicons name="ellipsis-horizontal" size={18} color={Colors.light.textLight} />
                </Pressable>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.light.card,
        borderRadius: 18,
        padding: 20,
        marginBottom: 16,

        // HTML: box-shadow: 0 4px 15px rgba(0,0,0,0.03)
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
    },

    meta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },

    headerRow: {
        flexDirection: 'row',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },

    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    tag: {
        fontSize: 11,
        color: Colors.light.primary,
        backgroundColor: '#eef3f3',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        alignSelf: 'flex-start',
        maxWidth: '40%',
        overflow: 'hidden',
    },

    date: {
        fontSize: 11,
        color: Colors.light.textLight,
    },

    title: {
        fontSize: 15,
        fontWeight: '600',
        color: Colors.light.text,
        marginLeft: 8,
        flex: 1,
    },

    content: {
        fontSize: 15,
        lineHeight: 26, // HTML line-height: 1.7
        color: Colors.light.text,
    },

    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
    },

    words: {
        fontSize: 10,
        color: '#ccc',
        textAlign: 'right',
    },

    deleteButton: {
        paddingHorizontal: 6,
        paddingVertical: 4,
        borderRadius: 10,
        backgroundColor: '#fdecea',
        borderWidth: 1,
        borderColor: '#f5b7b1',
    },
})
