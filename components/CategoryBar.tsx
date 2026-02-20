import { Colors } from '@/constants/theme'
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native'

export type CategoryBarItem = {
    id: number | 'all'
    name: string
}

export default function CategoryBar({
    items,
    activeId,
    onChange,
}: {
    items: CategoryBarItem[]
    activeId: CategoryBarItem['id']
    onChange: (id: CategoryBarItem['id']) => void
}) {
    return (
        <View style={styles.wrapper}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.container}
            >
                {items.map(item => {
                    const isActive = item.id === activeId
                    return (
                        <Pressable
                            key={String(item.id)}
                            onPress={() => onChange(item.id)}
                            style={[
                                styles.item,
                                isActive && styles.activeItem,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.text,
                                    isActive && styles.activeText,
                                ]}
                            >
                                {item.name}
                            </Text>
                        </Pressable>
                    )
                })}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        paddingVertical: 10,
    },

    container: {
        paddingHorizontal: 16,
    },

    item: {
        paddingHorizontal: 18,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: '#fff',
        marginRight: 12,

        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
    },

    activeItem: {
        backgroundColor: Colors.light.primary,

        shadowColor: Colors.light.primary,
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },

    text: {
        fontSize: 13,
        color: Colors.light.textLight,
    },

    activeText: {
        color: '#fff',
        fontWeight: '500',
    },
})
