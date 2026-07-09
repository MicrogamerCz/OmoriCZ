// SPDX-License-Identifier: GPL-2.0-or-later
// SPDX-FileCopyrightText: 2026 Micro <microgamercz@proton.me>

import QtQuick
import QtQuick.Controls as Controls
import QtQuick.Layouts
import org.kde.kirigami as Kirigami
import "./controls" as Omori
import org.kde.omopatch

Kirigami.ApplicationWindow {
    id: root
    title: i18n("Omopatch")
    flags: Qt.FramelessWindowHint

    // TODO: fix aspect ratio, not size
    minimumWidth: 800
    width: 800
    maximumWidth: 800
    minimumHeight: 420
    height: 420
    maximumHeight: 420

    background: Rectangle {
        color: "white"
    }

    FontLoader {
        id: omoriFont
        source: "qrc:/qt/qml/org/kde/omopatch/contents/OMORI_GAME2.ttf"
    }

    ColumnLayout {
        spacing: 10
        anchors {
            left: parent.left
            right: parent.right
            verticalCenter: parent.verticalCenter
            margins: 15
        }

        Omori.Card {
            // Layout.fillHeight: true
            Layout.fillWidth: true
            Layout.preferredHeight: contentItem.implicitHeight + padding * 2
            padding: 20

            contentItem: Omori.Label {
                // anchors.margins: 20
                // anchors.centerIn: parent
                verticalAlignment: Text.AlignVCenter
                horizontalAlignment: Text.AlignHCenter
                font.pixelSize: 42
                text: "INSTALACE ČESKÉ LOKALIZACE OMORI"
            }
        }
        Omori.Card {
            // Layout.fillHeight: true
            Layout.fillWidth: true
            Layout.preferredHeight: contentItem.implicitHeight + padding * 2

            contentItem: Item {
                implicitWidth: hangmanSelect.implicitWidth
                implicitHeight: hangmanSelect.implicitHeight

                ColumnLayout {
                    id: hangmanSelect
                    // anchors.margins: 20
                    // anchors.topMargin: 30
                    // anchors.bottomMargin: 30
                    // anchors.fill: parent
                    anchors.centerIn: parent

                    Omori.Label {
                        text: Installer.message
                        visible: Installer.progress > 0
                    }

                    Omori.Label {
                        Layout.alignment: Qt.AlignHCenter
                        text: "Nainstalovat českou lokalizaci oběšence? (experimentální)"
                        visible: Installer.progress == 0
                    }

                    RowLayout {
                        spacing: 30
                        visible: Installer.progress == 0

                        Omori.Radio {
                            id: radioNo
                            enabled: false
                            checked: !true
                            text: "Ne"
                        }
                        Omori.Radio {
                            id: radioYes
                            enabled: false
                            checked: !false
                            text: "Ano"
                        }
                    }
                }
            }
        }
        Omori.Button {
            // Layout.fillHeight: true
            visible: Installer.progress == 0
            Layout.fillWidth: true
            Layout.minimumHeight: 80
            Layout.preferredHeight: contentItem.implicitHeight + padding * 2
            horizontalAlignment: Text.AlignLeft
            text: "Nainstalovat"
            leftPadding: 40
            onClicked: Installer.beginSetup()
        }
        Omori.Card {
            visible: Installer.progress > 0
            Layout.fillHeight: true
            Layout.fillWidth: true
            Layout.minimumHeight: 80

            contentItem: Item {
                Rectangle {
                    color: "white"
                    border.width: 2
                    border.color: "black"
                    anchors.fill: parent
                    anchors.margins: 3

                    Omori.ProgressBar {
                        id: progress
                        anchors.fill: parent

                        NumberAnimation on value {
                            from: 0.0
                            to: 1.0
                            duration: 10000
                            loops: Animation.Infinite
                        }
                    }
                }
            }
        }
    }

    Rectangle {
        anchors.fill: parent
        color: "white"
        opacity: 0
    }
}
