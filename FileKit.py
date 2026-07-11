import os
import shlex
import subprocess
import threading
import tkinter as tk
from tkinter import filedialog, messagebox

import customtkinter as ctk

from PIL import Image

ctk.set_appearance_mode("light")
ctk.set_default_color_theme("blue")


class FileKitLauncher(ctk.CTk):
    COMMANDS = {
        "File / Folder Size": {
            "flag": "-size",
            "description": "Inspect the size of a file or folder.",
            "fields": [
                {
                    "name": "source",
                    "label": "File or folder",
                    "type": "path",
                    "mode": "any",
                },
                {
                    "name": "unit",
                    "label": "Output unit",
                    "type": "choice",
                    "values": ["-b", "-kb", "-mb", "-gb"],
                    "default": "-mb",
                },
            ],
        },
        "Segment Files": {
            "flag": "-seg",
            "description": "Organize files from one folder into another.",
            "fields": [
                {
                    "name": "source",
                    "label": "Source folder",
                    "type": "path",
                    "mode": "folder",
                },
                {
                    "name": "destination",
                    "label": "Destination folder",
                    "type": "path",
                    "mode": "folder",
                },
            ],
        },
        "Remove Duplicate Files": {
            "flag": "-rmdf",
            "description": "Find and remove duplicate files from a folder.",
            "fields": [
                {
                    "name": "source",
                    "label": "Folder",
                    "type": "path",
                    "mode": "folder",
                },
            ],
        },
        "Print Folder Tree": {
            "flag": "-tree",
            "description": "Display a visual directory tree.",
            "fields": [
                {
                    "name": "source",
                    "label": "Folder",
                    "type": "path",
                    "mode": "folder",
                },
            ],
        },
        "Move File": {
            "flag": "-mv",
            "description": "Move a file into another folder.",
            "fields": [
                {
                    "name": "source",
                    "label": "Source file",
                    "type": "path",
                    "mode": "file",
                },
                {
                    "name": "destination",
                    "label": "Destination folder",
                    "type": "path",
                    "mode": "folder",
                },
            ],
        },
        "Create File": {
            "flag": "-create",
            "description": "Create a new file in the selected folder.",
            "fields": [
                {
                    "name": "filename",
                    "label": "File name",
                    "type": "text",
                    "placeholder": "file.txt",
                },
                {
                    "name": "destination",
                    "label": "Destination folder",
                    "type": "path",
                    "mode": "folder",
                },
            ],
        },
        "File Properties": {
            "flag": "-props",
            "description": "Read detailed file or folder properties.",
            "fields": [
                {
                    "name": "source",
                    "label": "File or folder",
                    "type": "path",
                    "mode": "any",
                },
            ],
        },
        "Squash File": {
            "flag": "-squash",
            "description": "Compress a file into FileKit's squash format.",
            "fields": [
                {
                    "name": "source",
                    "label": "Source file",
                    "type": "path",
                    "mode": "file",
                },
                {
                    "name": "output_name",
                    "label": "Output name",
                    "type": "text",
                    "placeholder": "squashed",
                },
            ],
        },
        "Desquash File": {
            "flag": "-desquash",
            "description": "Restore a previously squashed file.",
            "fields": [
                {
                    "name": "source",
                    "label": "Squashed file",
                    "type": "path",
                    "mode": "file",
                },
            ],
        },
        "Top Largest Files": {
            "flag": "-top",
            "description": "List the largest files in a folder.",
            "fields": [
                {
                    "name": "count",
                    "label": "Number of files",
                    "type": "number",
                    "default": "5",
                },
                {
                    "name": "source",
                    "label": "Folder",
                    "type": "path",
                    "mode": "folder",
                },
                {
                    "name": "unit",
                    "label": "Output unit",
                    "type": "choice",
                    "values": ["-b", "-kb", "-mb", "-gb"],
                    "default": "-mb",
                },
                {
                    "name": "show_path",
                    "label": "Show full path",
                    "type": "check",
                    "value": "-path",
                },
            ],
        },
        "Folder Statistics": {
            "flag": "-stats",
            "description": "Generate a complete folder statistics summary.",
            "fields": [
                {
                    "name": "source",
                    "label": "Folder",
                    "type": "path",
                    "mode": "folder",
                },
            ],
        },
    }

    COLORS = {
        "window": "#EEF1F6",
        "glass": "#F7F9FC",
        "card": "#FFFFFF",
        "card_alt": "#F8FAFD",
        "border": "#DDE3EC",
        "border_soft": "#E8ECF2",
        "text": "#111827",
        "muted": "#6B7280",
        "hint": "#9CA3AF",
        "blue": "#007AFF",
        "blue_hover": "#0066D6",
        "blue_soft": "#EAF3FF",
        "green": "#28A745",
        "danger": "#D92D20",
        "terminal": "#F6F8FB",
        "shadow": "#D8DEE8",
    }

    def __init__(self):
        super().__init__()

        self.title("FileKit")
        self.geometry("1120x780")
        self.minsize(960, 700)
        self.configure(fg_color=self.COLORS["window"])

        # Load logo for use beside the FileKit title
        icon_path = "./FileKit.png"

        self.logo_image = ctk.CTkImage(
            light_image=Image.open(icon_path),
            dark_image=Image.open(icon_path),
            size=(48, 48),
        )

        self.jar_path = tk.StringVar(value=self.default_jar_path())
        self.command_name = tk.StringVar(value="File / Folder Size")
        self.command_preview = tk.StringVar()
        self.status_text = tk.StringVar(value="Ready")
        self.field_vars = {}
        self.running = False

        self.grid_columnconfigure(0, weight=1)
        self.grid_rowconfigure(0, weight=1)

        self.build_ui()
        self.render_fields()

    @staticmethod
    def default_jar_path():
        local_jar = os.path.join(os.getcwd(), "FileKit.jar")
        return local_jar if os.path.exists(local_jar) else "FileKit.jar"

    def create_glass_card(self, parent, corner_radius=22):
        card = ctk.CTkFrame(
            parent,
            fg_color="#FFFFFF",
            corner_radius=22,
            border_width=1,
            border_color="#ECECEC",
        )
        return card

    def build_ui(self):
        shell = ctk.CTkFrame(
            self,
            fg_color="transparent",
        )
        
        shell.grid(
        row=0,
        column=0,
        sticky="nsew",
        padx=15,
        pady=15,
    )
        shell.grid_columnconfigure(0, weight=1)
        shell.grid_rowconfigure(2, weight=1)

        self.build_header(shell)

        content = ctk.CTkFrame(shell, fg_color="transparent")
        content.grid(row=1, column=0, sticky="nsew")
        content.grid_columnconfigure(0, weight=1)
        content.grid_columnconfigure(1, weight=1)
        content.grid_rowconfigure(0, weight=1)

        self.configuration_card = self.create_glass_card(content)
        self.configuration_card.grid(
    row=0,
    column=0,
    sticky="nsew",
    padx=(0,15),
    pady=5,
)

        self.output_card = self.create_glass_card(content)
        self.output_card.grid(
    row=0,
    column=1,
    sticky="nsew",
    padx=(15,0),
    pady=5,
)

        self.configuration_card.grid_columnconfigure(0, weight=1)
        self.configuration_card.grid_rowconfigure(4, weight=1)

        self.output_card.grid_columnconfigure(0, weight=1)
        self.output_card.grid_rowconfigure(2, weight=1)

        self.build_configuration_panel()
        self.build_output_panel()
        self.build_footer(shell)

    def build_header(self, parent):
        header = ctk.CTkFrame(parent, fg_color="transparent")
        header.grid(row=0, column=0, sticky="ew", pady=(0, 18))
        header.grid_columnconfigure(0, weight=1)

        brand = ctk.CTkFrame(header, fg_color="transparent")
        brand.grid(row=0, column=0, sticky="w")

        logo_label = ctk.CTkLabel(
            brand,
            image=self.logo_image,
            text="",
        )
        logo_label.grid(
            row=0,
            column=0,
            rowspan=2,
            padx=(0, 14),
        )

        ctk.CTkLabel(
            brand,
            text="FileKit",
            text_color=self.COLORS["text"],
            font=("SF Pro Display", 30, "bold"),
        ).grid(row=0, column=1, sticky="w")

        

        status_chip = ctk.CTkFrame(
            header,
            fg_color="#FFFFFF",
            corner_radius=18,
            border_width=1,
            border_color=self.COLORS["border"],
        )
        status_chip.grid(row=0, column=1, sticky="e")

        self.status_dot = ctk.CTkLabel(
            status_chip,
            text="●",
            text_color=self.COLORS["green"],
            font=("Arial", 12),
        )
        self.status_dot.grid(row=0, column=0, padx=(14, 6), pady=8)

        ctk.CTkLabel(
            status_chip,
            textvariable=self.status_text,
            text_color=self.COLORS["muted"],
            font=("SF Pro Text", 12, "bold"),
        ).grid(row=0, column=1, padx=(0, 14), pady=8)

    def build_configuration_panel(self):
        panel = self.configuration_card

        ctk.CTkLabel(
            panel,
            text="Configuration",
            text_color=self.COLORS["text"],
            font=("SF Pro Display", 19, "bold"),
        ).grid(row=0, column=0, sticky="w", padx=24, pady=(22, 2))

        self.operation_description = ctk.CTkLabel(
            panel,
            text="",
            text_color=self.COLORS["muted"],
            font=("SF Pro Text", 12),
        )
        self.operation_description.grid(
            row=1, column=0, sticky="w", padx=24, pady=(0, 18)
        )

        jar_section = ctk.CTkFrame(panel, fg_color="transparent")
        jar_section.grid(row=2, column=0, sticky="ew", padx=24)
        jar_section.grid_columnconfigure(0, weight=1)

        self.create_field_label(jar_section, "FileKit JAR").grid(
            row=0, column=0, columnspan=2, sticky="w", pady=(0, 7)
        )

        jar_entry = self.create_entry(
            jar_section,
            textvariable=self.jar_path,
            placeholder_text="Select FileKit.jar",
        )
        jar_entry.grid(row=1, column=0, sticky="ew", padx=(0, 10))
        jar_entry.bind("<KeyRelease>", lambda _event: self.update_preview())

        self.create_secondary_button(
            jar_section,
            text="Browse",
            command=self.browse_jar,
            width=96,
        ).grid(row=1, column=1)

        operation_section = ctk.CTkFrame(panel, fg_color="transparent")
        operation_section.grid(
            row=3, column=0, sticky="ew", padx=24, pady=(18, 0)
        )
        operation_section.grid_columnconfigure(0, weight=1)

        self.create_field_label(operation_section, "Operation").grid(
            row=0, column=0, sticky="w", pady=(0, 7)
        )

        operation_menu = ctk.CTkOptionMenu(
            operation_section,
            variable=self.command_name,
            values=list(self.COMMANDS.keys()),
            command=lambda _value: self.render_fields(),
            height=46,
            corner_radius=16,
            fg_color=self.COLORS["card_alt"],
            button_color=self.COLORS["blue_soft"],
            button_hover_color="#DCEBFF",
            text_color=self.COLORS["text"],
            dropdown_fg_color="#FFFFFF",
            dropdown_hover_color=self.COLORS["blue_soft"],
            dropdown_text_color=self.COLORS["text"],
            font=("SF Pro Text", 13),
            dropdown_font=("SF Pro Text", 13),
        )
        operation_menu.grid(row=1, column=0, sticky="ew")

        self.fields_scroll = ctk.CTkScrollableFrame(
            panel,
            fg_color="transparent",
            scrollbar_button_color="#CBD5E1",
            scrollbar_button_hover_color="#94A3B8",
        )
        self.fields_scroll.grid(
            row=4,
            column=0,
            sticky="nsew",
            padx=16,
            pady=(10, 16),
        )
        self.fields_scroll.grid_columnconfigure(0, weight=1)

    def build_output_panel(self):
        panel = self.output_card

        header = ctk.CTkFrame(panel, fg_color="transparent")
        header.grid(row=0, column=0, sticky="ew", padx=24, pady=(22, 14))
        header.grid_columnconfigure(0, weight=1)

        ctk.CTkLabel(
            header,
            text="Output",
            text_color=self.COLORS["text"],
            font=("SF Pro Display", 19, "bold"),
        ).grid(row=0, column=0, sticky="w")

        self.create_secondary_button(
            header,
            text="Clear",
            command=self.clear_output,
            width=84,
        ).grid(row=0, column=1, sticky="e")

        terminal_shell = ctk.CTkFrame(
            panel,
            fg_color=self.COLORS["terminal"],
            corner_radius=22,
            border_width=1,
            border_color=self.COLORS["border_soft"],
        )
        terminal_shell.grid(
            row=2, column=0, sticky="nsew", padx=24, pady=(0, 24)
        )
        terminal_shell.grid_columnconfigure(0, weight=1)
        terminal_shell.grid_rowconfigure(1, weight=1)

        terminal_header = ctk.CTkFrame(
            terminal_shell,
            fg_color="#F0F3F8",
            corner_radius=18,
            height=42,
        )
        terminal_header.grid(
            row=0, column=0, sticky="ew", padx=8, pady=(8, 4)
        )
        terminal_header.grid_propagate(False)

        self.output = ctk.CTkTextbox(
            terminal_shell,
            wrap="none",
            fg_color=self.COLORS["terminal"],
            text_color=self.COLORS["text"],
            corner_radius=0,
            border_width=0,
            font=("SFMono-Regular", 12),
            scrollbar_button_color="#CBD5E1",
            scrollbar_button_hover_color="#94A3B8",
        )
        self.output.grid(
            row=1,
            column=0,
            sticky="nsew",
            padx=10,
            pady=(4, 10),
        )

    def build_footer(self, parent):
        footer = ctk.CTkFrame(parent, fg_color="transparent")
        footer.grid(row=2, column=0, sticky="ew", pady=(18, 0))
        footer.grid_columnconfigure(0, weight=1)

        ctk.CTkLabel(
            footer,
            text="Java must be installed and available in PATH.",
            text_color=self.COLORS["hint"],
            font=("SF Pro Text", 11),
        ).grid(row=0, column=0, sticky="w")

        self.run_button = ctk.CTkButton(
            footer,
            text="START",
            command=self.start_command,
            width=180,
            height=48,
            corner_radius=18,
            fg_color=self.COLORS["blue"],
            hover_color=self.COLORS["blue_hover"],
            text_color="#FFFFFF",
            font=("SF Pro Text", 14, "bold"),
            border_width=0,
        )
        self.run_button.grid(row=0, column=1, sticky="e")

    def create_field_label(self, parent, text):
        return ctk.CTkLabel(
            parent,
            text=text,
            text_color=self.COLORS["text"],
            font=("SF Pro Text", 12, "bold"),
        )

    def create_entry(self, parent, textvariable, placeholder_text=""):
        return ctk.CTkEntry(
            parent,
            textvariable=textvariable,
            placeholder_text=placeholder_text,
            height=46,
            corner_radius=16,
            fg_color=self.COLORS["card_alt"],
            border_width=1,
            border_color=self.COLORS["border"],
            text_color=self.COLORS["text"],
            placeholder_text_color=self.COLORS["hint"],
            font=("SF Pro Text", 13),
        )

    def create_secondary_button(self, parent, text, command, width=100):
        return ctk.CTkButton(
            parent,
            text=text,
            command=command,
            width=width,
            height=42,
            corner_radius=15,
            fg_color=self.COLORS["blue_soft"],
            hover_color="#DCEBFF",
            text_color=self.COLORS["blue"],
            font=("SF Pro Text", 12, "bold"),
            border_width=0,
        )

    def render_fields(self):
        for widget in self.fields_scroll.winfo_children():
            widget.destroy()

        self.field_vars.clear()
        spec = self.COMMANDS[self.command_name.get()]
        self.operation_description.configure(text=spec["description"])

        fields = spec["fields"]

        for index, field in enumerate(fields):
            field_type = field["type"]

            field_card = ctk.CTkFrame(
                self.fields_scroll,
                fg_color=self.COLORS["card_alt"],
                corner_radius=18,
                border_width=1,
                border_color=self.COLORS["border_soft"],
            )
            field_card.grid(
                row=index,
                column=0,
                sticky="ew",
                padx=8,
                pady=6,
            )
            field_card.grid_columnconfigure(0, weight=1)

            if field_type == "check":
                variable = tk.BooleanVar(value=False)
                self.field_vars[field["name"]] = variable

                checkbox = ctk.CTkCheckBox(
                    field_card,
                    text=field["label"],
                    variable=variable,
                    command=self.update_preview,
                    checkbox_width=22,
                    checkbox_height=22,
                    corner_radius=7,
                    border_width=2,
                    fg_color=self.COLORS["blue"],
                    hover_color=self.COLORS["blue_hover"],
                    border_color="#B8C2D0",
                    text_color=self.COLORS["text"],
                    font=("SF Pro Text", 13),
                )
                checkbox.grid(
                    row=0,
                    column=0,
                    sticky="w",
                    padx=16,
                    pady=16,
                )
                continue

            self.create_field_label(field_card, field["label"]).grid(
                row=0,
                column=0,
                columnspan=2,
                sticky="w",
                padx=16,
                pady=(14, 8),
            )

            default = field.get("default", "")
            variable = tk.StringVar(value=default)
            self.field_vars[field["name"]] = variable

            if field_type == "choice":
                option_menu = ctk.CTkSegmentedButton(
                    field_card,
                    values=field["values"],
                    variable=variable,
                    command=lambda _value: self.update_preview(),
                    height=40,
                    corner_radius=14,
                    fg_color="#E9EDF3",
                    selected_color=self.COLORS["blue"],
                    selected_hover_color=self.COLORS["blue_hover"],
                    unselected_color="#E9EDF3",
                    unselected_hover_color="#DDE3EA",
                    text_color="#FFFFFF",
                    font=("SF Pro Text", 12, "bold"),
                )
                option_menu.grid(
                    row=1,
                    column=0,
                    columnspan=2,
                    sticky="ew",
                    padx=14,
                    pady=(0, 14),
                )
            else:
                entry = self.create_entry(
                    field_card,
                    textvariable=variable,
                    placeholder_text=field.get("placeholder", ""),
                )
                entry.grid(
                    row=1,
                    column=0,
                    sticky="ew",
                    padx=(14, 8) if field_type == "path" else 14,
                    pady=(0, 14),
                )
                entry.bind("<KeyRelease>", lambda _event: self.update_preview())

                if field_type == "path":
                    self.create_secondary_button(
                        field_card,
                        text="Browse",
                        command=lambda f=field: self.browse_path(f),
                        width=88,
                    ).grid(
                        row=1,
                        column=1,
                        padx=(0, 14),
                        pady=(0, 14),
                    )

        self.update_preview()

    def browse_jar(self):
        selected = filedialog.askopenfilename(
            title="Select FileKit.jar",
            filetypes=[("JAR files", "*.jar"), ("All files", "*.*")],
        )
        if selected:
            self.jar_path.set(selected)
            self.update_preview()

    def browse_path(self, field):
        mode = field.get("mode", "any")

        if mode == "folder":
            selected = filedialog.askdirectory(
                title=f"Select {field['label']}"
            )
        elif mode == "file":
            selected = filedialog.askopenfilename(
                title=f"Select {field['label']}"
            )
        else:
            selected = filedialog.askopenfilename(
                title=f"Select {field['label']}"
            )
            if not selected:
                selected = filedialog.askdirectory(
                    title=f"Select {field['label']}"
                )

        if selected:
            self.field_vars[field["name"]].set(selected)
            self.update_preview()

    def build_command(self):
        jar = self.jar_path.get().strip() or "FileKit.jar"
        spec = self.COMMANDS[self.command_name.get()]

        command = [
            "java",
            "-Dfile.encoding=UTF-8",
            "-Dsun.stdout.encoding=UTF-8",
            "-Dsun.stderr.encoding=UTF-8",
            "-jar",
            jar,
            spec["flag"],
        ]

        for field in spec["fields"]:
            variable = self.field_vars.get(field["name"])

            if variable is None:
                continue

            if field["type"] == "check":
                if variable.get():
                    command.append(field["value"])
                continue

            value = variable.get().strip()

            if value:
                command.append(value)

        return command

    @staticmethod
    def format_command(command):
        if os.name == "nt":
            return subprocess.list2cmdline(command)
        return shlex.join(command)

    def update_preview(self):
        self.command_preview.set(self.format_command(self.build_command()))

    def validate_command(self):
        spec = self.COMMANDS[self.command_name.get()]

        if not self.jar_path.get().strip():
            messagebox.showerror(
                "Missing JAR",
                "Select or enter the FileKit JAR path.",
            )
            return False

        for field in spec["fields"]:
            if field["type"] == "check":
                continue

            value = self.field_vars[field["name"]].get().strip()

            if not value:
                messagebox.showerror(
                    "Missing value",
                    f"Enter a value for: {field['label']}",
                )
                return False

            if field["type"] == "number":
                try:
                    number = int(value)
                    if number <= 0:
                        raise ValueError
                except ValueError:
                    messagebox.showerror(
                        "Invalid number",
                        f"{field['label']} must be a positive whole number.",
                    )
                    return False

        return True

    def start_command(self):
        if self.running or not self.validate_command():
            return

        self.running = True
        self.run_button.configure(
            state="disabled",
            text="Running…",
            fg_color="#9FCBFF",
        )
        self.status_text.set("Running")
        self.status_dot.configure(text_color=self.COLORS["blue"])

        self.append_output(
            f"$ {self.command_preview.get()}\n\n"
        )

        worker = threading.Thread(
            target=self.execute_command,
            daemon=True,
        )
        worker.start()

    def execute_command(self):
        command = self.build_command()

        try:
            process = subprocess.Popen(
                command,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                encoding="utf-8",
                errors="replace",
                bufsize=1,
            )

            if process.stdout:
                for line in process.stdout:
                    self.after(0, self.append_output, line)

            exit_code = process.wait()

            if exit_code == 0:
                self.after(
                    0,
                    self.finish_command,
                    "Completed successfully",
                    True,
                )
            else:
                self.after(
                    0,
                    self.finish_command,
                    f"Command exited with code {exit_code}",
                    False,
                )

        except FileNotFoundError:
            self.after(
                0,
                self.handle_error,
                "Java was not found. Install Java or add it to the system PATH.",
            )
        except Exception as exc:
            self.after(
                0,
                self.handle_error,
                str(exc),
            )

    def finish_command(self, message, successful):
        self.append_output(f"\n{message}\n")
        self.status_text.set(message)
        self.status_dot.configure(
            text_color=(
                self.COLORS["green"]
                if successful
                else self.COLORS["danger"]
            )
        )
        self.running = False
        self.run_button.configure(
            state="normal",
            text="Run Command",
            fg_color=self.COLORS["blue"],
        )

    def handle_error(self, message):
        self.append_output(f"\nError: {message}\n")
        self.status_text.set("Failed")
        self.status_dot.configure(text_color=self.COLORS["danger"])
        self.running = False
        self.run_button.configure(
            state="normal",
            text="Run Command",
            fg_color=self.COLORS["blue"],
        )
        messagebox.showerror("FileKit Error", message)

    def append_output(self, text):
        self.output.insert("end", text)
        self.output.see("end")

    def clear_output(self):
        self.output.delete("1.0", "end")
        self.status_text.set("Ready")
        self.status_dot.configure(text_color=self.COLORS["green"])

    def copy_command(self):
        command = self.command_preview.get()
        self.clipboard_clear()
        self.clipboard_append(command)
        self.status_text.set("Command copied")
        self.status_dot.configure(text_color=self.COLORS["blue"])


if __name__ == "__main__":
    app = FileKitLauncher()
    app.mainloop()
