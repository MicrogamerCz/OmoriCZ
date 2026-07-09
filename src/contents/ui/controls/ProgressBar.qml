import QtQuick
import QtQuick.Controls.Basic

ProgressBar {
    id: control
    value: 0.5
    padding: 2

    background: Item {}
    contentItem: Image {
        property string variant: "a"
        source: `qrc:/qt/qml/org/kde/omopatch/contents/progress/${variant}${Math.ceil(control.visualPosition * 10)}.png`
        smooth: false
        fillMode: Image.PreserveAspectFit

        Timer {
            triggeredOnStart: true
            interval: 230
            repeat: true
            running: true
            onTriggered: parent.variant = (parent.variant === "a") ? "b" : "a"
        }
    }
}
