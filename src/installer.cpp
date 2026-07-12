// SPDX-License-Identifier: GPL-2.0-or-later
// SPDX-FileCopyrightText: 2026 Micro <microgamercz@proton.me>

#include "installer.h"
#include <VDF/include/vdf_parser.hpp>
#include <fstream>
#include <memory>
#include <qdir.h>
#include <qurl.h>

using namespace tyti;

Installer::Installer(QObject *parent) : QObject(parent), m_progress(0) {
}

void Installer::beginSetup() {
    m_progress = 0;
    m_message = u"Příprava"_s;
    Q_EMIT dataChanged();

    QString libraryFoldersPath = steamPath.resolved(QUrl(u"./libraryfolders.vdf"_s)).toLocalFile();
    qDebug() << "Library folders path: " << libraryFoldersPath.toStdString();
    std::ifstream libraryFoldersFile(libraryFoldersPath.toStdString());
    if (!libraryFoldersFile.is_open()) {
        m_progress = 10;
        m_message = u"Nepodařilo se otevřít "_s + libraryFoldersPath;
        Q_EMIT dataChanged();
        return;
    }

    auto root = vdf::read(libraryFoldersFile);
    qDebug() << root.name;
    for (auto [_, child] : root.childs) {
        qDebug() << "\t" << child->name;
    }
}
