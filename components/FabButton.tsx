import { View, Pressable, StyleSheet } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { Colors } from '@/constants/theme'

export default function FabButton() {
    const router = useRouter()

    return (
        <View style={styles.wrapper}>
            <Pressable
                onPress={() => router.push('/modal')}
                style={({ pressed }) => [
                    styles.fab,
                    pressed && styles.pressed,
                ]}
            >
                <FontAwesome name="plus" size={24} color="#fff" />
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        bottom: -5,
        alignSelf: 'center',
        zIndex: 10000,
    },

    fab: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: Colors.light.primary,
        justifyContent: 'center',
        alignItems: 'center',

        borderWidth: 5,
        borderColor: Colors.light.background,

        shadowColor: Colors.light.primary,
        shadowOpacity: 0.5,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
    },

    pressed: {
        transform: [{ scale: 0.9 }],
        shadowOpacity: 0.3,
    },
})
