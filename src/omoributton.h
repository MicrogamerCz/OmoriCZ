// SPDX-License-Identifier: GPL-2.0-or-later
// SPDX-FileCopyrightText: 2026 Micro <microgamercz@proton.me>

#pragma once

#include <QPushButton>

class OmoriButton : public QPushButton {
    Q_OBJECT

  public:
    OmoriButton(const QString &text, QWidget *parent = nullptr);

    QSize sizeHint() const override;

  protected:
    void paintEvent(QPaintEvent *event) override;
};
