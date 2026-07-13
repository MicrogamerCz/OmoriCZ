// SPDX-License-Identifier: GPL-2.0-or-later
// SPDX-FileCopyrightText: 2026 Micro <microgamercz@proton.me>

#pragma once
#include "omoricard.h"
#include <qlabel.h>
#include <qtmetamacros.h>

using namespace Qt::Literals::StringLiterals;

class OptionsMessageCard : public OmoriCard {
    Q_OBJECT

    const QString optionsMessage = u"Vytvořit zálohu savů?"_s;

  public:
    OptionsMessageCard();

    void resetMessage();
    Q_SIGNAL void setMessage(const QString &string);
};
