# SPDX-FileCopyrightText: 2026 Micro <microgamercz@proton.me>
# SPDX-License-Identifier: BSD-3-Clause

cmake_minimum_required(VERSION 3.16)

project(omopatch VERSION 0.1)

set(CMAKE_CXX_STANDARD 23)
set(QT6_MIN_VERSION 6.5.0)
set(KF6_MIN_VERSION 6.12.0)

find_package(ECM ${KF6_MIN_VERSION} REQUIRED NO_MODULE)

# set(QT_QML_GENERATE_QMLLS_INI ON)
set(CMAKE_EXPORT_COMPILE_COMMANDS ON)
set(CMAKE_MODULE_PATH ${CMAKE_MODULE_PATH} ${ECM_MODULE_PATH})

include(FeatureSummary)
include(KDEInstallDirs)
include(KDECMakeSettings)
include(KDECompilerSettings NO_POLICY_SCOPE)
# include(ECMSetupVersion)
# include(ECMFindQmlModule)
# if (NOT ANDROID)
    # include(KDEGitCommitHooks)
    # include(KDEClangFormat)
# endif()

# ecm_setup_version(${PROJECT_VERSION}
    # VARIABLE_PREFIX OMOPATCH
    # VERSION_HEADER "${CMAKE_CURRENT_BINARY_DIR}/src/version-omopatch.h"
# )

find_package(Qt6 ${QT6_MIN_VERSION} REQUIRED COMPONENTS Network Widgets)
find_package(QuaZip-Qt6)
# find_package(KF6 ${KF6_MIN_VERSION} REQUIRED COMPONENTS Kirigami CoreAddons Config I18n)

# qt_policy(SET QTP0001 NEW)

# ecm_find_qmlmodule(org.kde.kirigamiaddons.formcard 1.0)

add_subdirectory(src)

install(FILES org.kde.omopatch.desktop DESTINATION ${KDE_INSTALL_APPDIR})
install(FILES org.kde.omopatch.metainfo.xml DESTINATION ${KDE_INSTALL_METAINFODIR})

feature_summary(WHAT ALL FATAL_ON_MISSING_REQUIRED_PACKAGES)

# if (NOT ANDROID)
    # file(GLOB_RECURSE ALL_CLANG_FORMAT_SOURCE_FILES src/*.cpp src/*.h)
    # kde_clang_format(${ALL_CLANG_FORMAT_SOURCE_FILES})
    # kde_configure_git_pre_commit_hook(CHECKS CLANG_FORMAT)
# endif()
