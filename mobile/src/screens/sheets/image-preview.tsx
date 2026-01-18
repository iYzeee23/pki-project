import { Image, Modal, Pressable, View } from "react-native";

type Props = {
  visible: boolean;
  uri: string | null;
  onClose: () => void;
};

export function ImagePreview({ visible, uri, onClose }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        onPress={onClose}
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.7)",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View
            style={{
              borderRadius: 16,
              overflow: "hidden",
              backgroundColor: "white",
            }}
          >
            {uri ? (
              <Image
                source={{ uri }}
                style={{
                  width: 360,
                  height: 360,
                  resizeMode: "contain",
                }}
              />
            ) : null}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
