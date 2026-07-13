// SPDX-License-Identifier: GPL-2.0-or-later
// SPDX-FileCopyrightText: 2026 Micro <microgamercz@proton.me>

#include "installer.h"
#include <VDF/include/vdf_parser.hpp>
#include <fstream>
#include <qdir.h>
#include <qurl.h>

using namespace tyti;

Installer::Installer(QObject *parent) : QObject(parent), m_progress(0) {
}

void Installer::beginSetup() {
    Q_EMIT installingChanged(true);

    Q_EMIT progressChanged(m_progress = 1);
    Q_EMIT messageChanged(u"Příprava"_s);

    QString libraryFoldersPath = steamPath.resolved(QUrl(u"./libraryfolders.vdf"_s)).toLocalFile();

    std::ifstream libraryFoldersFile(libraryFoldersPath.toStdString());
    if (!libraryFoldersFile.is_open()) {
        Q_EMIT progressChanged(m_progress = 10);
        Q_EMIT messageChanged(u"Nepodařilo se otevřít "_s + libraryFoldersPath);
        return;
    }

    auto root = vdf::read(libraryFoldersFile);
    qDebug() << root.name;
    for (auto [_, child] : root.childs) {
        qDebug() << "\t" << child->name;
    }
}
