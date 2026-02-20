import { Colors } from '@/constants/theme'
import { FontAwesome } from '@expo/vector-icons'
import { Pressable, StyleSheet, TextInput, View } from 'react-native'

export default function Header({
    onCalendar,
    keyword,
    onChangeKeyword,
    isCalendarOpen,
}: {
    onCalendar?: () => void
    keyword: string
    onChangeKeyword: (value: string) => void
    isCalendarOpen?: boolean
}) {
    return (
        <View style={styles.container}>
            <Pressable
                onPress={onCalendar}
                style={[
                    styles.calendarButton,
                    isCalendarOpen && styles.calendarButtonActive,
                ]}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <FontAwesome
                    name="calendar"
                    size={20}
                    color={isCalendarOpen ? Colors.light.primary : Colors.light.textLight}
                />
            </Pressable>

            <View style={styles.searchWrapper}>
                <FontAwesome
                    name="search"
                    size={16}
                    color={Colors.light.textLight}
                    style={styles.searchIcon}
                />
                <TextInput
                    value={keyword}
                    onChangeText={onChangeKeyword}
                    placeholder="搜索笔记…"
                    placeholderTextColor={Colors.light.textLight}
                    style={styles.searchInput}
                    returnKeyType="search"
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },

    calendarButton: {
        padding: 10,
        borderRadius: 999,
        backgroundColor: '#f4f6f8',
        minWidth: 40,
        minHeight: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    calendarButtonActive: {
        backgroundColor: '#eef3f3',
    },

    searchWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f4f6f8',
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 6,
    },

    searchIcon: {
        marginRight: 6,
    },

    searchInput: {
        flex: 1,
        fontSize: 14,
        color: Colors.light.text,
    },
})
