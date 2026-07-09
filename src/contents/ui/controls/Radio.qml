import QtQuick
import QtQuick.Controls.Basic
import "." as Omori

RadioButton {
    id: control
    checked: true
    spacing: 12

    indicator: Item {
        implicitWidth: 58
        implicitHeight: 30

        x: control.leftPadding
        y: parent.height / 2 - height / 2

        Image {
            width: 58
            height: 30
            source: "qrc:/qt/qml/org/kde/omopatch/contents/radio.png"
            smooth: false
            visible: control.checked

            SequentialAnimation on x {
                loops: Animation.Infinite

                NumberAnimation {
                    from: 0
                    to: 10
                    duration: 225
                    easing.type: Easing.Linear
                }

                NumberAnimation {
                    from: 10
                    to: 10
                    duration: 150
                    easing.type: Easing.Linear
                }

                NumberAnimation {
                    from: 10
                    to: 0
                    duration: 225
                    easing.type: Easing.Linear
                }

                NumberAnimation {
                    from: 0
                    to: 0
                    duration: 150
                    easing.type: Easing.Linear
                }
            }
        }
    }

    contentItem: Omori.Label {
        text: control.text
        verticalAlignment: Text.AlignVCenter
        leftPadding: control.indicator.width + control.spacing
    }
}
