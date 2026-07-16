# SPDX-FileCopyrightText: 2026 Micro <microgamercz@proton.me>
# SPDX-License-Identifier: BSD-3-Clause

cmake_minimum_required(VERSION 3.16)

project(omopatch VERSION 0.1)

set(CMAKE_CXX_STANDARD 23)
set(QT6_MIN_VERSION 6.5.0)
set(KF6_MIN_VERSION 6.12.0)

find_package(ECM ${KF6_MIN_VERSION} REQUIRED NO_MODULE)

set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} ${ECM_MODULE_PATH})

include(FeatureSummary)
include(KDEInstallDirs)
include(KDECMakeSettings)
include(KDECompilerSettings NO_POLICY_SCOPE)

find_package(Qt6 ${QT6_MIN_VERSION} REQUIRED COMPONENTS Network Widgets)
find_package(QuaZip-Qt6)

add_subdirectory(src)

install(FILES omopatch.desktop DESTINATION ${KDE_INSTALL_APPDIR})
install(FILES src/contents/omori.png DESTINATION ${KDE_INSTALL_ICONDIR}/hicolor/scalable/apps)

feature_summary(WHAT ALL FATAL_ON_MISSING_REQUIRED_PACKAGES)
