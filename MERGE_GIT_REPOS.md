# 合并两个 Git 仓库的步骤

## ✅ 已完成

1. ✅ 已提交 app 目录下的更改（在 app/.git 中）
2. ✅ 已合并两个 .gitignore 文件
3. ✅ 已清理 git 锁文件

## 📝 需要手动执行的步骤

### 步骤 1: 删除 app/.git 目录

由于权限限制，请手动删除 `app/.git` 目录。有以下几种方法：

**方法 1: 使用 Finder（推荐）**
1. 打开 Finder，导航到 `/Users/zhouming.wang/workspace/rn/sport_records/app`
2. 按 `Cmd + Shift + .` 显示隐藏文件
3. 找到 `.git` 文件夹，右键删除或拖到废纸篓
4. 清空废纸篓

**方法 2: 使用终端（如果权限允许）**
```bash
cd /Users/zhouming.wang/workspace/rn/sport_records
rm -rf app/.git
```

**方法 3: 使用 sudo（如果上述方法都不行）**
```bash
cd /Users/zhouming.wang/workspace/rn/sport_records
sudo rm -rf app/.git
```

### 步骤 2: 清理 git 锁文件（如果有）

```bash
cd /Users/zhouming.wang/workspace/rn/sport_records
rm -f .git/index.lock
```

### 步骤 3: 将 app 目录添加到根目录 git

```bash
cd /Users/zhouming.wang/workspace/rn/sport_records
git add app/
git status
```

### 步骤 4: 提交更改

```bash
git commit -m "Merge app directory into main repository"
```

## 🔍 验证

完成后，运行以下命令验证：

```bash
# 应该只看到一个 git 仓库
cd /Users/zhouming.wang/workspace/rn/sport_records
git status

# app 目录下不应该有 .git
ls -la app/ | grep .git
# 应该没有输出
```

## 📌 注意事项

- 删除 `app/.git` 后，app 目录的历史记录会丢失（但文件会保留）
- 如果需要保留 app 目录的完整历史，可以使用 `git subtree` 或 `git submodule`，但通常不需要
- 合并后的 `.gitignore` 已经包含了两个仓库的所有忽略规则
