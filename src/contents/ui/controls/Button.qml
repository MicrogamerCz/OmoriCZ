import QtQuick
import QtQuick.Controls
import "." as Omori

AbstractButton {
    id: control
    property alias horizontalAlignment: label.horizontalAlignment
    property alias verticalAlignment: label.verticalAlignment
    padding: 20

    contentItem: Omori.Label {
        id: label
        text: control.text
        horizontalAlignment: Text.AlignHCenter
        verticalAlignment: Text.AlignVCenter
        elide: Text.ElideRight
    }
    background: Omori.CardBackground {}
}
