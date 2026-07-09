# SPDX-License-Identifier: BSD-2-Clause
# SPDX-FileCopyrightText: 2026 Micro <microgamercz@proton.me>

# Target: static library
qt_add_qml_module(omopatch_static
    STATIC
    URI org.kde.omopatch
    VERSION 1.0
    RESOURCES
        contents/OMORI_GAME2.ttf
        contents/radio.png
        contents/progress/a1.png
        contents/progress/a2.png
        contents/progress/a3.png
        contents/progress/a4.png
        contents/progress/a5.png
        contents/progress/a6.png
        contents/progress/a7.png
        contents/progress/a8.png
        contents/progress/a9.png
        contents/progress/a10.png
        contents/progress/b1.png
        contents/progress/b2.png
        contents/progress/b3.png
        contents/progress/b4.png
        contents/progress/b5.png
        contents/progress/b6.png
        contents/progress/b7.png
        contents/progress/b8.png
        contents/progress/b9.png
        contents/progress/b10.png
    QML_FILES
        contents/ui/Main.qml
        contents/ui/controls/Button.qml
        contents/ui/controls/Card.qml
        contents/ui/controls/CardBackground.qml
        contents/ui/controls/Label.qml
        contents/ui/controls/ProgressBar.qml
        contents/ui/controls/Radio.qml
)

target_compile_options (omopatch_static PUBLIC -fexceptions -Wno-undef)

target_sources(omopatch_static PUBLIC installer.cpp)

target_link_libraries(omopatch_static PUBLIC
    Qt6::Core
    Qt6::Gui
    Qt6::Qml
    Qt6::Quick
    Qt6::QuickControls2
    Qt6::Svg
    KF6::I18n
    KF6::CoreAddons
)
target_include_directories(omopatch_static PUBLIC ${CMAKE_BINARY_DIR})

if (ANDROID)
    kirigami_package_breeze_icons(ICONS
        list-add
        help-about
        application-exit
        applications-graphics
    )
else()
    target_link_libraries(omopatch_static PUBLIC Qt::Widgets)
endif()

# Target: main executable
add_executable(omopatch main.cpp)
target_link_libraries(omopatch PUBLIC omopatch_static omopatch_staticplugin)
install(TARGETS omopatch ${KDE_INSTALL_TARGETS_DEFAULT_ARGS})
