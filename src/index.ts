import codePush, { LocalPackage } from 'react-native-code-push'
import { AppState } from 'react-native'
import { useEffect } from 'react'

export function useCodePushCheck({ onSync, onSyncError, onCheckFinished }: { onSync?: (meta: LocalPackage | null) => void | Promise<void>, onSyncError?: (e: Error) => void | Promise<void>, onCheckFinished?: () => void | Promise<void> }) {
    useEffect(() => {
        const listener = async () => {
            try {
                const availableUpdate = await codePush.checkForUpdate();
                if (availableUpdate) {
                    await codePush.sync({
                        installMode: codePush.InstallMode.IMMEDIATE,
                    });
                    const meta = await codePush.getUpdateMetadata()
                    onSync && onSync(meta)
                }
            } catch (e) {
                onSyncError && onSyncError(e as Error)
            } finally {
                onCheckFinished && onCheckFinished()
            }
        }
        const sub = AppState.addEventListener("change", listener)
        listener()
        return () => {
            sub.remove()
        }
    }, [])
}
